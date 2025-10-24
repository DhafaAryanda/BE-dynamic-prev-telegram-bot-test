import TelegramBot from "node-telegram-bot-api";
import { TelegramService } from "../services/telegram.service";
import { MessageTemplateFactory } from "../services/message-template.factory";
import { logger } from "../utils/logger";
import { botEventEmitter } from "../events/event-emitter";

/**
 * Base Controller
 * Template Method Pattern - provides common functionality for all controllers
 */
export abstract class BaseController {
  protected telegramService: TelegramService;
  protected messageFactory: MessageTemplateFactory;

  // Group IDs
  protected requesterGroupId: number = 0;
  protected approverGroupId: number = 0;
  protected adminGroupId: number = 0;

  constructor() {
    // Singleton instances
    this.telegramService = TelegramService.getInstance();
    this.messageFactory = MessageTemplateFactory.getInstance();

    // Initialize group IDs
    this.initializeGroupIds();
  }

  /**
   * Initialize group IDs
   */
  private async initializeGroupIds(): Promise<void> {
    try {
      logger.debug("Group IDs initialized", {
        requesterGroupId: this.requesterGroupId,
        approverGroupId: this.approverGroupId,
        adminGroupId: this.adminGroupId,
      });
    } catch (error) {
      logger.error("Failed to initialize group IDs", { error });
    }
  }

  /**
   * Check if chat is from group
   */
  protected isChatFromGroup(chatId: number): boolean {
    const groups: number[] = [
      this.requesterGroupId,
      this.approverGroupId,
      this.adminGroupId,
    ];

    return groups.includes(chatId);
  }

  /**
   * Check if chat is from requester group
   */
  protected isChatFromRequesterGroup(chatId: number): boolean {
    return chatId === this.requesterGroupId;
  }

  /**
   * Check if chat is from approver group
   */
  protected isChatFromApproverGroup(chatId: number): boolean {
    return chatId === this.approverGroupId;
  }

  /**
   * Check if chat is from admin group
   */
  protected isChatFromAdminGroup(chatId: number): boolean {
    return chatId === this.adminGroupId;
  }

  /**
   * Send message using template
   */
  protected async sendMessage(
    chatId: number,
    text: string,
    options?: TelegramBot.SendMessageOptions
  ): Promise<TelegramBot.Message> {
    return await this.telegramService.sendMessage(chatId, text, options);
  }

  /**
   * Send error message
   */
  protected async sendErrorMessage(
    chatId: number,
    message: string,
    details?: string
  ): Promise<TelegramBot.Message> {
    const { text, options } = this.messageFactory.error(message, details);
    return await this.telegramService.sendMessage(chatId, text, options);
  }

  /**
   * Send success message
   */
  protected async sendSuccessMessage(
    chatId: number,
    message: string,
    details?: string
  ): Promise<TelegramBot.Message> {
    const { text, options } = this.messageFactory.success(message, details);
    return await this.telegramService.sendMessage(chatId, text, options);
  }

  /**
   * Send unauthorized message
   */
  protected async sendUnauthorizedMessage(
    chatId: number,
    requiredRole?: string
  ): Promise<TelegramBot.Message> {
    const { text, options } = this.messageFactory.unauthorized(requiredRole);
    return await this.telegramService.sendMessage(chatId, text, options);
  }

  /**
   * Abstract method - must be implemented by child controllers
   */
  abstract initialize(): Promise<void>;
}
