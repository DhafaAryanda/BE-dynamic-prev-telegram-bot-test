import TelegramBot from "node-telegram-bot-api";
import { User } from "../database/entities/user.entity";

/**
 * Message Template Factory
 * Provides consistent message formatting across the application
 */

// Type definitions for message data
export interface MessageData {
  taskId?: string;
  requester?: {
    firstName: string;
    username?: string;
  };
  request?: {
    activity: string;
    startedAt: string;
    endedAt: string;
    timezone: string;
  };
  activity?: {
    name: string;
  };
  duties?: string[];
  [key: string]: any;
}

export class MessageTemplateFactory {
  private static instance: MessageTemplateFactory;

  private constructor() {}

  static getInstance(): MessageTemplateFactory {
    if (!MessageTemplateFactory.instance) {
      MessageTemplateFactory.instance = new MessageTemplateFactory();
    }
    return MessageTemplateFactory.instance;
  }

  /**
   * Format date from unix timestamp
   */
  private formatDate(timestamp: string, timezone: string = "WIB"): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return `${date.toLocaleString("id-ID")} ${timezone}`;
  }

  /**
   * Format username
   */
  private formatUsername(username?: string): string {
    return username ? `@${username}` : "N/A";
  }

  // ===== NORMAL MESSAGES =====

  /**
   * Request confirmation message
   */
  requestConfirmation(
    message: TelegramBot.Message,
    messageData: MessageData
  ): { text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
✅ <b>Request Confirmation</b>

Your request has been submitted successfully!

<b>Task ID:</b> ${messageData.taskId}
<b>Activity:</b> ${messageData.request?.activity}
<b>Start Time:</b> ${this.formatDate(
      messageData.request?.startedAt || "",
      messageData.request?.timezone
    )}
<b>End Time:</b> ${this.formatDate(
      messageData.request?.endedAt || "",
      messageData.request?.timezone
    )}

Your request is now waiting for approval.
    `.trim();

    return {
      text,
      options: {
        parse_mode: "HTML",
        reply_to_message_id: message.message_id,
      },
    };
  }

  /**
   * New approval request to approver
   */
  approvalRequestNew(
    chatId: number,
    messageData: MessageData
  ): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
🔔 <b>New Approval Request</b>

<b>Task ID:</b> ${messageData.taskId}
<b>Requester:</b> ${messageData.requester?.firstName} ${this.formatUsername(
      messageData.requester?.username
    )}
<b>Activity:</b> ${messageData.activity?.name}
<b>Start Time:</b> ${this.formatDate(
      messageData.request?.startedAt || "",
      messageData.request?.timezone
    )}
<b>End Time:</b> ${this.formatDate(
      messageData.request?.endedAt || "",
      messageData.request?.timezone
    )}

Please review and approve this request.
    `.trim();

    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "✅ Approve",
            callback_data: `approve_${messageData.taskId}`,
          },
          { text: "❌ Reject", callback_data: `reject_${messageData.taskId}` },
        ],
        [
          {
            text: "📝 Details",
            callback_data: `details_${messageData.taskId}`,
          },
        ],
      ],
    };

    return {
      chatId,
      text,
      options: {
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    };
  }

  /**
   * 5 minutes reminder to approver
   */
  approvalReminderFiveMinutes(
    chatId: number,
    messageData: MessageData,
    duties: string[]
  ): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
⏰ <b>Reminder: 5 Minutes</b>

<b>Task ID:</b> ${messageData.taskId}
<b>Activity:</b> ${messageData.activity?.name}
<b>Start Time:</b> ${this.formatDate(
      messageData.request?.startedAt || "",
      messageData.request?.timezone
    )}

<b>Assigned Duties:</b>
${duties.map((duty, index) => `${index + 1}. ${duty}`).join("\n")}

⚠️ <b>Activity will start in 5 minutes!</b>
    `.trim();

    return {
      chatId,
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * 10 minutes reminder to approver
   */
  approvalReminderTenMinutes(
    chatId: number,
    messageData: MessageData,
    duties: string[]
  ): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
⏰ <b>Reminder: 10 Minutes</b>

<b>Task ID:</b> ${messageData.taskId}
<b>Activity:</b> ${messageData.activity?.name}
<b>Start Time:</b> ${this.formatDate(
      messageData.request?.startedAt || "",
      messageData.request?.timezone
    )}

<b>Assigned Duties:</b>
${duties.map((duty, index) => `${index + 1}. ${duty}`).join("\n")}

⚠️ <b>Activity will start in 10 minutes!</b>
    `.trim();

    return {
      chatId,
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * ISE Scheduling success to admin
   */
  iseSchedulingSuccess(
    chatId: number,
    request: MessageData
  ): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
✅ <b>ISE Scheduling Success</b>

<b>Task ID:</b> ${request.taskId}
<b>Activity:</b> ${request.activity?.name}
<b>Start Time:</b> ${this.formatDate(
      request.request?.startedAt || "",
      request.request?.timezone
    )}
<b>End Time:</b> ${this.formatDate(
      request.request?.endedAt || "",
      request.request?.timezone
    )}

The activity has been successfully scheduled in ISE system.
    `.trim();

    return {
      chatId,
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * ISE Scheduling failed to admin
   */
  iseSchedulingFailed(
    chatId: number,
    request: MessageData
  ): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
❌ <b>ISE Scheduling Failed</b>

<b>Task ID:</b> ${request.taskId}
<b>Activity:</b> ${request.activity?.name}
<b>Start Time:</b> ${this.formatDate(
      request.request?.startedAt || "",
      request.request?.timezone
    )}

Failed to schedule the activity in ISE system. Please check manually.
    `.trim();

    return {
      chatId,
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  // ===== DISMISSABLE MESSAGES =====

  /**
   * Bot start message (dismissable)
   */
  botStart(
    message: TelegramBot.Message,
    user: User
  ): { text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
👋 <b>Welcome to DP Request Bot!</b>

Hello ${user.getDisplayName()}!

<b>Your Role:</b> ${user.role}

<b>Available Commands:</b>
/start - Start the bot
/help - Show help information
/rqopen - Create new request
/status - Check request status
/myrequest - View your requests

Choose an option below or use a command to get started.
    `.trim();

    const keyboard = {
      inline_keyboard: [
        [{ text: "📝 Create Request", callback_data: "create_request" }],
        [{ text: "📊 My Requests", callback_data: "my_requests" }],
        [{ text: "❓ Help", callback_data: "help" }],
        [{ text: "❌ Dismiss", callback_data: "dismiss" }],
      ],
    };

    return {
      text,
      options: {
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    };
  }

  /**
   * Help message
   */
  help(user: User): { text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
📚 <b>Help & Commands</b>

<b>Your Role:</b> ${user.role}

<b>General Commands:</b>
/start - Start the bot
/help - Show this help message
/status - Check request status

<b>Requester Commands:</b>
/rqopen - Create new request
Format: /rqopen <activity> <pic> <start_date> <start_time> <end_date> <end_time> <timezone>
Example: /rqopen migrasi john,doe 2024-01-01 08:00 2024-01-01 10:00 WIB

/myrequest - View your requests

<b>Approver Commands:</b>
/pending - View pending approvals
/approve <task_id> - Approve request
/reject <task_id> <reason> - Reject request

<b>Admin Commands:</b>
/stats - View bot statistics
/users - List all users
/groups - List all groups

Need more help? Contact your administrator.
    `.trim();

    return {
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * Error message
   */
  error(
    message: string,
    details?: string
  ): { text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
❌ <b>Error</b>

${message}

${details ? `\n<b>Details:</b>\n${details}` : ""}

Please try again or contact administrator if the problem persists.
    `.trim();

    return {
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * Success message
   */
  success(
    message: string,
    details?: string
  ): { text: string; options: TelegramBot.SendMessageOptions } {
    const text = `
✅ <b>Success</b>

${message}

${details ? `\n<b>Details:</b>\n${details}` : ""}
    `.trim();

    return {
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }

  /**
   * Unauthorized message
   */
  unauthorized(requiredRole?: string): {
    text: string;
    options: TelegramBot.SendMessageOptions;
  } {
    const text = `
🚫 <b>Unauthorized Access</b>

You don't have permission to perform this action.

${requiredRole ? `<b>Required Role:</b> ${requiredRole}` : ""}

Please contact your administrator if you believe this is an error.
    `.trim();

    return {
      text,
      options: {
        parse_mode: "HTML",
      },
    };
  }
}
