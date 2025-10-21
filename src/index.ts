import "reflect-metadata";
import { initializeDatabase } from "./database/data-source";
import { BotService } from "./services/bot.service";
import { WebhookServer } from "./app/webhook.server";
import { CommandHandlers } from "./command/command-handlers";
import { EventHandlers } from "./events/event-handlers";
import { config } from "./config/config";
import { logger } from "./utils/logger";
import { ErrorHandler } from "./utils/error-handler";

class TelegramBotApp {
  private botService: BotService;
  private webhookServer: WebhookServer;
  private commandHandlers: CommandHandlers;

  constructor() {
    this.botService = new BotService();
    this.webhookServer = new WebhookServer(this.botService);
    this.commandHandlers = new CommandHandlers(this.botService);
  }

  async initialize(): Promise<void> {
    try {
      logger.info("🚀 Starting Telegram Bot Application...");

      // Initialize database
      logger.info("📊 Initializing database...");
      await initializeDatabase();

      // Initialize event handlers
      logger.info("🎯 Setting up event handlers...");
      EventHandlers.initialize();

      // Initialize bot service
      logger.info("🤖 Initializing bot service...");
      await this.botService.initialize();

      // Initialize command handlers
      logger.info("⌨️ Setting up command handlers...");
      await this.commandHandlers.initialize();

      // Start webhook server
      logger.info("🌐 Starting webhook server...");
      await this.webhookServer.start();

      logger.info("✅ Telegram Bot Application started successfully!");
      logger.info(
        `🔗 Health check: http://localhost:${config.server.port}/health`
      );
      logger.info(`📡 Webhook: ${config.telegram.webhookUrl}/webhook`);
    } catch (error) {
      ErrorHandler.handle(error as Error, { context: "Application startup" });
      logger.error("❌ Failed to start application", { error });
      process.exit(1);
    }
  }

  async shutdown(): Promise<void> {
    logger.info("🛑 Shutting down application...");
    // Add cleanup logic here if needed
    process.exit(0);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("\n🛑 Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("\n🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  logger.error("💥 Uncaught Exception", { error });
  ErrorHandler.handle(error, { context: "Uncaught Exception" });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("💥 Unhandled Rejection", { reason, promise });
  ErrorHandler.handle(reason as Error, { context: "Unhandled Rejection" });
  process.exit(1);
});

// Start the application
const app = new TelegramBotApp();
app.initialize().catch((error) => {
  logger.error("💥 Application failed to start", { error });
  ErrorHandler.handle(error, { context: "Application initialization" });
  process.exit(1);
});
