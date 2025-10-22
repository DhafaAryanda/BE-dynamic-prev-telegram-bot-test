import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config";
import { User } from "../database/entities/user.entity";
import { botEventEmitter } from "../events/event-emitter";
import {
  TelegramUpdate,
  BotCommand,
  BotCallback,
} from "../types/telegram.types";
import { logger } from "../utils/logger";
import { ErrorHandler, BotError } from "../utils/error-handler";
import { UserRepository } from "../database/repositories/user.repository";

export class BotService {
  private bot: TelegramBot;
  private commands: Map<string, BotCommand> = new Map();
  private callbacks: BotCallback[] = [];
  private userRepository: UserRepository;

  constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    this.userRepository = new UserRepository();
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

    const user = await this.getOrCreateUser(message.from);
    botEventEmitter.emit("message:received", message, user);

    // Handle commands
    if (message.text?.startsWith("/")) {
      await this.handleCommand(message, user);
    }
  }

  private async handleCallbackQuery(
    callbackQuery: TelegramBot.CallbackQuery
  ): Promise<void> {
    if (!callbackQuery.from) return;

    const user = await this.getOrCreateUser(callbackQuery.from);
    botEventEmitter.emit("callback:received", callbackQuery, user);

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

  private async handleCommand(
    message: TelegramBot.Message,
    user: User
  ): Promise<void> {
    const commandText = message.text?.split(" ")[0];
    if (!commandText) return;

    const command = this.commands.get(commandText);
    if (command) {
      await command.handler(message);
    }
  }

  private async getOrCreateUser(telegramUser: TelegramBot.User): Promise<User> {
    try {
      let user = await this.userRepository.findByTelegramId(telegramUser.id);

      if (!user) {
        user = await this.userRepository.create({
          telegramId: telegramUser.id,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          username: telegramUser.username,
          languageCode: telegramUser.language_code,
          isBot: telegramUser.is_bot,
          isPremium: (telegramUser as any).is_premium || false,
        });

        logger.info(`New user registered: ${user.getDisplayName()}`, {
          telegramId: user.telegramId,
        });
        botEventEmitter.emit("user:register", user);
      } else {
        // Update user info if changed
        const hasChanges =
          user.firstName !== telegramUser.first_name ||
          user.lastName !== telegramUser.last_name ||
          user.username !== telegramUser.username ||
          user.languageCode !== telegramUser.language_code ||
          user.isPremium !== ((telegramUser as any).is_premium || false);

        if (hasChanges) {
          user.firstName = telegramUser.first_name;
          user.lastName = telegramUser.last_name;
          user.username = telegramUser.username;
          user.languageCode = telegramUser.language_code;
          user.isPremium = (telegramUser as any).is_premium || false;

          await this.userRepository.save(user);
          logger.debug(`User info updated: ${user.getDisplayName()}`);
          botEventEmitter.emit("user:update", user);
        }
      }

      return user;
    } catch (error) {
      ErrorHandler.handle(error as Error, {
        context: "getOrCreateUser",
        telegramId: telegramUser.id,
      });
      throw error;
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
