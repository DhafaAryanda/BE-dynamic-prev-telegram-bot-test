import { Message } from "node-telegram-bot-api";
import { BotService } from "../services/bot.service";
import { User } from "../database/entities/user.entity";
import { botEventEmitter } from "../events/event-emitter";
import { UserRepository } from "../database/repositories/user.repository";
import { logger } from "../utils/logger";

export class CommandHandlers {
  private userRepository: UserRepository;

  constructor(private botService: BotService) {
    this.userRepository = new UserRepository();
  }

  async initialize(): Promise<void> {
    // Register all commands
    this.botService.registerCommand({
      command: "/start",
      description: "Start the bot",
      handler: this.handleStart.bind(this),
    });

    this.botService.registerCommand({
      command: "/help",
      description: "Show help information",
      handler: this.handleHelp.bind(this),
    });

    this.botService.registerCommand({
      command: "/profile",
      description: "Show your profile",
      handler: this.handleProfile.bind(this),
    });

    this.botService.registerCommand({
      command: "/settings",
      description: "Bot settings",
      handler: this.handleSettings.bind(this),
    });

    this.botService.registerCommand({
      command: "/stats",
      description: "Show bot statistics",
      handler: this.handleStats.bind(this),
    });

    // Register callbacks
    this.botService.registerCallback({
      pattern: /^settings_/,
      handler: this.handleSettingsCallback.bind(this),
    });
  }

  private async handleStart(message: Message): Promise<void> {
    if (!message.from) return;

    const user = await this.getUser(message.from.id);
    botEventEmitter.emit("command:start", message, user);

    const welcomeText = `
🎉 Welcome to Safir Bot!

Hello ${user.getDisplayName()}! I'm your personal assistant bot.

Available commands:
/help - Show help information
/profile - View your profile
/settings - Bot settings
/stats - Show bot statistics

How can I help you today?
    `.trim();

    await this.botService.sendMessage(message.chat.id, welcomeText, {
      parse_mode: "HTML",
    });
  }

  private async handleHelp(message: Message): Promise<void> {
    if (!message.from) return;

    const user = await this.getUser(message.from.id);
    botEventEmitter.emit("command:help", message, user);

    const helpText = `
📚 <b>Help & Commands</b>

<b>Basic Commands:</b>
/start - Start the bot
/help - Show this help message
/profile - View your profile
/settings - Bot settings
/stats - Show bot statistics

<b>Features:</b>
• User management
• Event tracking
• Database integration
• Webhook support

<b>Need more help?</b>
Contact the administrator for assistance.
    `.trim();

    await this.botService.sendMessage(message.chat.id, helpText, {
      parse_mode: "HTML",
    });
  }

  private async handleProfile(message: Message): Promise<void> {
    if (!message.from) return;

    const user = await this.getUser(message.from.id);

    const profileText = `
👤 <b>Your Profile</b>

<b>Name:</b> ${user.getFullName()}
<b>Username:</b> ${user.username ? `@${user.username}` : "Not set"}
<b>Telegram ID:</b> <code>${user.telegramId}</code>
<b>Language:</b> ${user.languageCode || "Not set"}
<b>Premium:</b> ${user.isPremium ? "Yes" : "No"}
<b>Member since:</b> ${user.createdAt.toLocaleDateString()}
<b>Last activity:</b> ${
      user.lastActivity ? user.lastActivity.toLocaleString() : "Never"
    }
    `.trim();

    await this.botService.sendMessage(message.chat.id, profileText, {
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

  private async handleStats(message: Message): Promise<void> {
    if (!message.from) return;

    const user = await this.getUser(message.from.id);
    botEventEmitter.emit("command:stats", message, user);

    try {
      // Get bot statistics
      const totalUsers = await this.userRepository.count();
      const premiumUsers = await this.userRepository.countPremiumUsers();

      // Get users active today (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeUsersToday = await this.userRepository.countActiveUsers(
        yesterday
      );

      // Get users registered this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const newUsersThisWeek = await this.userRepository.countNewUsers(weekAgo);

      // Bot uptime
      const uptimeSeconds = Math.floor(process.uptime());
      const uptimeHours = Math.floor(uptimeSeconds / 3600);
      const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
      const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m`;

      const statsText = `
📊 <b>Bot Statistics</b>

<b>👥 Users:</b>
• Total Users: <b>${totalUsers}</b>
• Premium Users: <b>${premiumUsers}</b> ⭐
• Active Today: <b>${activeUsersToday}</b>
• New This Week: <b>+${newUsersThisWeek}</b> 🎉

<b>⚙️ System:</b>
• Uptime: <b>${uptimeFormatted}</b>
• Environment: <b>${process.env.NODE_ENV || "development"}</b>
• Memory Usage: <b>${Math.round(
        process.memoryUsage().heapUsed / 1024 / 1024
      )} MB</b>

<b>📅 Generated:</b> ${new Date().toLocaleString()}
      `.trim();

      await this.botService.sendMessage(message.chat.id, statsText, {
        parse_mode: "HTML",
      });
    } catch (error) {
      logger.error("Error fetching stats", { error });
      await this.botService.sendMessage(
        message.chat.id,
        "❌ Failed to fetch statistics. Please try again later.",
        { parse_mode: "HTML" }
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

  private async getUser(telegramId: number): Promise<User> {
    const user = await this.userRepository.findByTelegramId(telegramId);

    if (!user) {
      logger.error(`User not found`, { telegramId });
      throw new Error(`User with telegram ID ${telegramId} not found`);
    }

    return user;
  }
}
