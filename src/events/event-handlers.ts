import { botEventEmitter } from "./event-emitter";
import { Message, CallbackQuery } from "node-telegram-bot-api";
import { logger } from "../utils/logger";

// Event handlers for bot events
export class EventHandlers {
  static initialize(): void {
    // Error handlers
    botEventEmitter.on("error:bot", (error: Error, context?: any) => {
      logger.error("🤖 Bot Error", { message: error.message, context });
    });

    botEventEmitter.on("error:database", (error: Error, context?: any) => {
      logger.error("🗄️ Database Error", { message: error.message, context });
    });
  }
}
