import { botEventEmitter } from "./event-emitter";
import { User } from "../database/entities/user.entity";
import { Message, CallbackQuery } from "node-telegram-bot-api";
import { UserRepository } from "../database/repositories/user.repository";
import { logger } from "../utils/logger";

// Event handlers for bot events
export class EventHandlers {
  private static userRepository: UserRepository;

  static initialize(): void {
    this.userRepository = new UserRepository();

    // User registration handler
    botEventEmitter.on("user:register", async (user: User) => {
      logger.info(
        `👤 New user registered: ${user.getDisplayName()} (${user.telegramId})`
      );

      // You can add welcome message logic here
      // Or send notification to admin
    });

    // User update handler
    botEventEmitter.on("user:update", async (user: User) => {
      logger.debug(
        `👤 User updated: ${user.getDisplayName()} (${user.telegramId})`
      );
    });

    // Message received handler
    botEventEmitter.on(
      "message:received",
      async (message: Message, user: User) => {
        logger.debug(
          `💬 Message from ${user.getDisplayName()}: ${message.text?.substring(
            0,
            50
          )}...`
        );

        // Update user's last activity
        try {
          await this.userRepository.updateLastActivity(user.telegramId);
        } catch (error) {
          logger.error("Failed to update last activity", { error, user });
        }
      }
    );

    // Callback query handler
    botEventEmitter.on(
      "callback:received",
      async (callbackQuery: CallbackQuery, user: User) => {
        logger.debug(
          `🔘 Callback from ${user.getDisplayName()}: ${callbackQuery.data}`
        );
      }
    );

    // Command handlers
    botEventEmitter.on(
      "command:start",
      async (message: Message, user: User) => {
        logger.info(`🚀 Start command from ${user.getDisplayName()}`);
      }
    );

    botEventEmitter.on("command:help", async (message: Message, user: User) => {
      logger.info(`❓ Help command from ${user.getDisplayName()}`);
    });

    // Error handlers
    botEventEmitter.on("error:bot", (error: Error, context?: any) => {
      logger.error("🤖 Bot Error", { message: error.message, context });
    });

    botEventEmitter.on("error:database", (error: Error, context?: any) => {
      logger.error("🗄️ Database Error", { message: error.message, context });
    });
  }
}
