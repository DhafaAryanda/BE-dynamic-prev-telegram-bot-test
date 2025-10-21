import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "../config/config";
import { BotService } from "../services/bot.service";
import { TelegramUpdate } from "../types/telegram.types";
import { botEventEmitter } from "../events/event-emitter";
import { logger } from "../utils/logger";
import { ErrorHandler } from "../utils/error-handler";

export class WebhookServer {
  private app: express.Application;
  private botService: BotService;

  constructor(botService: BotService) {
    this.app = express();
    this.botService = botService;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors());

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // Webhook endpoint for Telegram
    this.app.post("/webhook", async (req, res) => {
      try {
        const update: TelegramUpdate = req.body;

        // Validate webhook secret if configured
        if (config.telegram.webhookSecret) {
          const secret = req.headers["x-telegram-bot-api-secret-token"];
          if (secret !== config.telegram.webhookSecret) {
            logger.warn("Invalid webhook secret attempt");
            return res.status(401).json({ error: "Unauthorized" });
          }
        }

        // Process the update
        await this.botService.handleUpdate(update);

        res.json({ ok: true });
      } catch (error) {
        ErrorHandler.handle(error as Error, { context: "webhook" });
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Set webhook endpoint
    this.app.post("/set-webhook", async (req, res) => {
      try {
        const webhookUrl = config.telegram.webhookUrl;
        if (!webhookUrl) {
          return res.status(400).json({ error: "Webhook URL not configured" });
        }

        const bot = this.botService.getBot();
        const result = await bot.setWebHook(webhookUrl, {
          secret_token: config.telegram.webhookSecret,
        });

        logger.info("Webhook set successfully", { webhookUrl });
        res.json({
          ok: result,
          webhookUrl,
          message: "Webhook set successfully",
        });
      } catch (error) {
        ErrorHandler.handle(error as Error, { context: "set-webhook" });
        res.status(500).json({ error: "Failed to set webhook" });
      }
    });

    // Delete webhook endpoint
    this.app.delete("/webhook", async (req, res) => {
      try {
        const bot = this.botService.getBot();
        const result = await bot.deleteWebHook();

        logger.info("Webhook deleted successfully");
        res.json({
          ok: result,
          message: "Webhook deleted successfully",
        });
      } catch (error) {
        ErrorHandler.handle(error as Error, { context: "delete-webhook" });
        res.status(500).json({ error: "Failed to delete webhook" });
      }
    });

    // Get webhook info
    this.app.get("/webhook-info", async (req, res) => {
      try {
        const bot = this.botService.getBot();
        const webhookInfo = await bot.getWebHookInfo();

        res.json(webhookInfo);
      } catch (error) {
        ErrorHandler.handle(error as Error, { context: "get-webhook-info" });
        res.status(500).json({ error: "Failed to get webhook info" });
      }
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({ error: "Not found" });
    });

    // Error handler
    this.app.use(
      (
        error: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        ErrorHandler.handle(error, { context: "express", path: req.path });
        res.status(500).json({ error: "Internal server error" });
      }
    );
  }

  async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(config.server.port, () => {
        logger.info(`🚀 Webhook server running on port ${config.server.port}`);
        logger.info(`📡 Webhook URL: ${config.telegram.webhookUrl}/webhook`);
        resolve();
      });
    });
  }

  getApp(): express.Application {
    return this.app;
  }
}
