import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config";
import { botEventEmitter } from "../events/event-emitter";
import {
  BotCallback,
  BotCommand,
  TelegramUpdate,
} from "../types/telegram.types";
import { BotError } from "../utils/error-handler";
import { logger } from "../utils/logger";

export class BotService {
  private bot: TelegramBot;
  private commands: Map<string, BotCommand> = new Map();
  private callbacks: BotCallback[] = [];

  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    this.bot.on("error", (error) => {
      botEventEmitter.emit("error:bot", error);
    });

    this.bot.on("polling_error", (error) => {
      botEventEmitter.emit("error:bot", error, { type: "polling" });
    });
  }

  async initialize(): Promise<void> {
    try {
      // Set bot commands
      await this.setBotCommands();

      // Auto-set webhook in production
      if (
        config.server.nodeEnv === "production" &&
        config.telegram.webhookUrl
      ) {
        await this.autoSetWebhook();
      }

      logger.info("✅ Bot service initialized successfully");
    } catch (error) {
      logger.error("❌ Error initializing bot service", { error });
      throw new BotError("Failed to initialize bot service");
    }
  }

  private async setBotCommands(): Promise<void> {
    const commands = [
      { command: "start", description: "Start the bot" },
      { command: "help", description: "Show help information" },
      { command: "profile", description: "Show your profile" },
      { command: "settings", description: "Bot settings" },
      { command: "stats", description: "Show bot statistics" },
      { command: "user", description: "Get all users from database" },
    ];

    await this.bot.setMyCommands(commands);
  }

  async handleUpdate(update: TelegramUpdate): Promise<void> {
    try {
      if (update.message) {
        await this.handleMessage(update.message);
      }

      if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      }
    } catch (error) {
      botEventEmitter.emit("error:bot", error as Error, { update });
    }
  }

  private async handleMessage(message: TelegramBot.Message): Promise<void> {
    if (!message.from) return;

    // Handle commands
    if (message.text?.startsWith("/")) {
      await this.handleCommand(message);
    }
  }

  private async handleCallbackQuery(
    callbackQuery: TelegramBot.CallbackQuery
  ): Promise<void> {
    if (!callbackQuery.from) return;

    // Handle callback patterns
    for (const callback of this.callbacks) {
      if (
        callbackQuery.data &&
        this.matchesPattern(callbackQuery.data, callback.pattern)
      ) {
        await callback.handler(callbackQuery);
        break;
      }
    }
  }

  private async handleCommand(message: TelegramBot.Message): Promise<void> {
    const commandText = message.text?.split(" ")[0];
    if (!commandText) return;

    const command = this.commands.get(commandText);
    if (command) {
      await command.handler(message);
    }
  }

  private matchesPattern(data: string, pattern: string | RegExp): boolean {
    if (typeof pattern === "string") {
      return data === pattern;
    }
    return pattern.test(data);
  }

  // Public methods for sending messages
  async sendMessage(
    chatId: number,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<TelegramBot.Message> {
    return this.bot.sendMessage(chatId, text, options);
  }

  async sendPhoto(
    chatId: number,
    photo: string,
    options?: TelegramBot.SendPhotoOptions
  ): Promise<TelegramBot.Message> {
    return this.bot.sendPhoto(chatId, photo, options);
  }

  async answerCallbackQuery(
    callbackQueryId: string,
    options?: TelegramBot.AnswerCallbackQueryOptions
  ): Promise<boolean> {
    return this.bot.answerCallbackQuery(callbackQueryId, options);
  }

  // Command registration
  registerCommand(command: BotCommand): void {
    this.commands.set(command.command, command);
  }

  // Callback registration
  registerCallback(callback: BotCallback): void {
    this.callbacks.push(callback);
  }

  // Auto-set webhook for production
  private async autoSetWebhook(): Promise<void> {
    try {
      const webhookUrl = `${config.telegram.webhookUrl}/webhook`;
      const secretToken = config.telegram.webhookSecret;

      await this.bot.setWebHook(webhookUrl, {
        secret_token: secretToken,
        allowed_updates: ["message", "callback_query"],
      });

      logger.info(`🔗 Webhook auto-set to: ${webhookUrl}`);
    } catch (error) {
      logger.error("❌ Failed to auto-set webhook", { error });
      // Don't throw error, just log it - webhook can be set manually
    }
  }

  // Get bot instance for advanced usage
  getBot(): TelegramBot {
    return this.bot;
  }
}
