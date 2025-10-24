import TelegramBot from "node-telegram-bot-api";
import { BaseController } from "./base.controller";
import { MessageData } from "../services/message-template.factory";
import { logger } from "../utils/logger";

/**
 * RequestController
 * Handles request-related commands
 */
export class RequestController extends BaseController {
  async initialize(): Promise<void> {
    logger.info("RequestController initialized");
  }

  async handleRequestOpen(message: TelegramBot.Message): Promise<void> {}
}
