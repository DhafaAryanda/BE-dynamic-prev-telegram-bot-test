import { Message } from "node-telegram-bot-api";
import { BotService } from "../services/bot.service";
import { botEventEmitter } from "../events/event-emitter";
import { logger } from "../utils/logger";
import { AppDataSource } from "../database/data-source";
import { UserEntity } from "../database/entities/user.entity";

export class CommandHandlers {
  constructor(private botService: BotService) {}

  async initialize(): Promise<void> {
    // Register all commands
    this.botService.registerCommand({
      command: "/start",
      description: "Start the bot",
      handler: this.handleStart.bind(this),
    });

    this.botService.registerCommand({
      command: "/settings",
      description: "Bot settings",
      handler: this.handleSettings.bind(this),
    });

    this.botService.registerCommand({
      command: "/user",
      description: "Get all users from database",
      handler: this.handleUser.bind(this),
    });

    // Register callbacks
    this.botService.registerCallback({
      pattern: /^settings_/,
      handler: this.handleSettingsCallback.bind(this),
    });
  }

  private async handleStart(message: Message): Promise<void> {
    if (!message.from) return;

    // const user = await this.getUser(message.from.id);
    // botEventEmitter.emit("command:start", message, user);

    const welcomeText = `
🎉 Welcome to Safir Bot!

Hello! I'm your personal assistant bot.

Available commands:
/help - Show help information
/profile - View your profile
/settings - Bot settings
/stats - Show bot statistics
/user - Get all users from database

How can I help you today?
    `.trim();

    await this.botService.sendMessage(message.chat.id, welcomeText, {
      parse_mode: "HTML",
    });
  }

  private async handleSettings(message: Message): Promise<void> {
    if (!message.from) return;

    const settingsText = `
⚙️ <b>Bot Settings</b>

Choose an option to configure:

🔔 Notifications
🌐 Language
📊 Privacy
ℹ️ About
    `.trim();

    const keyboard = {
      inline_keyboard: [
        [
          { text: "🔔 Notifications", callback_data: "settings_notifications" },
          { text: "🌐 Language", callback_data: "settings_language" },
        ],
        [
          { text: "📊 Privacy", callback_data: "settings_privacy" },
          { text: "ℹ️ About", callback_data: "settings_about" },
        ],
      ],
    };

    await this.botService.sendMessage(message.chat.id, settingsText, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  }

  private async handleUser(message: Message): Promise<void> {
    if (!message.from) return;

    try {
      // Get user repository from TypeORM
      const userRepository = AppDataSource.getRepository(UserEntity);

      // Fetch all users from database
      const users = await userRepository.find({
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          isActive: true,
          telegramId: true,
          createdAt: true,
        },
        take: 10, // Limit to 10 users to avoid message too long
      });

      if (users.length === 0) {
        await this.botService.sendMessage(
          message.chat.id,
          "❌ No users found in database."
        );
        return;
      }

      // Format user data into readable message
      let userText = "👥 <b>Users List</b>\n\n";
      userText += `📊 Total: ${users.length} user(s)\n`;
      userText += "━━━━━━━━━━━━━━━━━━━━\n\n";

      users.forEach((user, index) => {
        userText += `<b>${index + 1}. ${user.name}</b>\n`;
        userText += `   👤 Username: @${user.username}\n`;
        userText += `   📧 Email: ${user.email}\n`;
        userText += `   🆔 ID: ${user.id}\n`;
        userText += `   📱 Telegram ID: ${user.telegramId || "Not linked"}\n`;
        userText += `   ${user.isActive ? "✅ Active" : "❌ Inactive"}\n`;
        userText += `   📅 Created: ${new Date(
          user.createdAt
        ).toLocaleDateString()}\n`;
        userText += "\n";
      });

      await this.botService.sendMessage(message.chat.id, userText, {
        parse_mode: "HTML",
      });

      logger.info("User list requested", {
        requestedBy: message.from.id,
        totalUsers: users.length,
      });
    } catch (error) {
      logger.error("Error fetching users", { error });
      await this.botService.sendMessage(
        message.chat.id,
        "❌ Error fetching users from database. Please try again later."
      );
    }
  }

  private async handleSettingsCallback(callbackQuery: any): Promise<void> {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;

    let responseText = "";
    let keyboard = null;

    switch (data) {
      case "settings_notifications":
        responseText =
          "🔔 <b>Notification Settings</b>\n\nConfigure your notification preferences.";
        break;
      case "settings_language":
        responseText =
          "🌐 <b>Language Settings</b>\n\nSelect your preferred language.";
        break;
      case "settings_privacy":
        responseText =
          "📊 <b>Privacy Settings</b>\n\nManage your privacy and data preferences.";
        break;
      case "settings_about":
        responseText =
          "ℹ️ <b>About Safir Bot</b>\n\nVersion: 1.0.0\nBuilt with TypeScript, TypeORM, and PostgreSQL.";
        break;
      default:
        responseText = "❌ Unknown setting option.";
    }

    // Add back button
    keyboard = {
      inline_keyboard: [
        [{ text: "🔙 Back to Settings", callback_data: "settings_back" }],
      ],
    };

    await this.botService.sendMessage(chatId, responseText, {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });

    await this.botService.answerCallbackQuery(callbackQuery.id, {
      callback_query_id: callbackQuery.id,
      text: "Settings updated!",
    });
  }
}
