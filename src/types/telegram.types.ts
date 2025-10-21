import { Message, CallbackQuery, InlineQuery } from "node-telegram-bot-api";

export interface TelegramUpdate {
  update_id: number;
  message?: Message;
  edited_message?: Message;
  channel_post?: Message;
  edited_channel_post?: Message;
  inline_query?: InlineQuery;
  chosen_inline_result?: any;
  callback_query?: CallbackQuery;
  shipping_query?: any;
  pre_checkout_query?: any;
  poll?: any;
  poll_answer?: any;
  my_chat_member?: any;
  chat_member?: any;
  chat_join_request?: any;
}

export interface BotCommand {
  command: string;
  description: string;
  handler: (message: Message) => Promise<void>;
}

export interface BotCallback {
  pattern: string | RegExp;
  handler: (callbackQuery: CallbackQuery) => Promise<void>;
}

export interface UserContext {
  user: {
    id: string;
    telegramId: number;
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  message: Message;
}
