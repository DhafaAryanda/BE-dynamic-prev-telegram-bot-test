import TelegramBot from "node-telegram-bot-api";
import { config } from "../config/config";
import { logger } from "../utils/logger";
import { BotError } from "../utils/error-handler";

/**
 * TelegramService - Singleton Pattern
 * Single bot instance shared across the application
 */
export class TelegramService {
  private static instance: TelegramService;
  private bot: TelegramBot;

  private constructor() {
    this.bot = new TelegramBot(config.telegram.botToken, { polling: false });
    logger.info("🤖 TelegramService initialized (Singleton)");
  }

  /**
   * Get singleton instance
   */
  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  /**
   * Get bot instance
   */
  getBot(): TelegramBot {
    return this.bot;
  }

  /**
   * Send message
   */
  async sendMessage(
    chatId: number,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<TelegramBot.Message> {
    try {
      return await this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      logger.error("Failed to send message", { chatId, error });
      throw new BotError("Failed to send message");
    }
  }

  /**
   * Send photo
   */
  async sendPhoto(
    chatId: number,
    photo: string,
    options?: TelegramBot.SendPhotoOptions
  ): Promise<TelegramBot.Message> {
    try {
      return await this.bot.sendPhoto(chatId, photo, options);
    } catch (error) {
      logger.error("Failed to send photo", { chatId, error });
      throw new BotError("Failed to send photo");
    }
  }

  /**
   * Send document
   */
  async sendDocument(
    chatId: number,
    document: string | Buffer,
    options?: TelegramBot.SendDocumentOptions
  ): Promise<TelegramBot.Message> {
    try {
      return await this.bot.sendDocument(chatId, document, options);
    } catch (error) {
      logger.error("Failed to send document", { chatId, error });
      throw new BotError("Failed to send document");
    }
  }

  /**
   * Edit message text
   */
  async editMessageText(
    text: string,
    options: TelegramBot.EditMessageTextOptions
  ): Promise<TelegramBot.Message | boolean> {
    try {
      return await this.bot.editMessageText(text, options);
    } catch (error) {
      logger.error("Failed to edit message", { error });
      throw new BotError("Failed to edit message");
    }
  }

  /**
   * Delete message
   */
  async deleteMessage(chatId: number, messageId: number): Promise<boolean> {
    try {
      return await this.bot.deleteMessage(chatId, messageId.toString());
    } catch (error) {
      logger.error("Failed to delete message", { chatId, messageId, error });
      throw new BotError("Failed to delete message");
    }
  }

  /**
   * Answer callback query
   */
  async answerCallbackQuery(
    callbackQueryId: string,
    options?: TelegramBot.AnswerCallbackQueryOptions
  ): Promise<boolean> {
    try {
      return await this.bot.answerCallbackQuery(callbackQueryId, options);
    } catch (error) {
      logger.error("Failed to answer callback query", { error });
      throw new BotError("Failed to answer callback query");
    }
  }

  /**
   * Get chat member
   */
  async getChatMember(
    chatId: number | string,
    userId: number
  ): Promise<TelegramBot.ChatMember> {
    try {
      return await this.bot.getChatMember(chatId, userId.toString());
    } catch (error) {
      logger.error("Failed to get chat member", { chatId, userId, error });
      throw new BotError("Failed to get chat member");
    }
  }

  /**
   * Get chat
   */
  async getChat(chatId: number | string): Promise<TelegramBot.Chat> {
    try {
      return await this.bot.getChat(chatId);
    } catch (error) {
      logger.error("Failed to get chat", { chatId, error });
      throw new BotError("Failed to get chat");
    }
  }

  /**
   * Set webhook
   */
  async setWebhook(
    url: string,
    options?: TelegramBot.SetWebHookOptions
  ): Promise<boolean> {
    try {
      return await this.bot.setWebHook(url, options);
    } catch (error) {
      logger.error("Failed to set webhook", { url, error });
      throw new BotError("Failed to set webhook");
    }
  }

  /**
   * Get webhook info
   */
  async getWebhookInfo(): Promise<TelegramBot.WebhookInfo> {
    try {
      return await this.bot.getWebHookInfo();
    } catch (error) {
      logger.error("Failed to get webhook info", { error });
      throw new BotError("Failed to get webhook info");
    }
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(): Promise<boolean> {
    try {
      return await this.bot.deleteWebHook();
    } catch (error) {
      logger.error("Failed to delete webhook", { error });
      throw new BotError("Failed to delete webhook");
    }
  }
}
