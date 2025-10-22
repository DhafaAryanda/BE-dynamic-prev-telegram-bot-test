import { EventEmitter } from "events";
import { Message, CallbackQuery } from "node-telegram-bot-api";
import { User } from "../database/entities/user.entity";

export interface BotEvents {
  "user:register": (user: User) => void;
  "user:update": (user: User) => void;
  "message:received": (message: Message, user: User) => void;
  "callback:received": (callbackQuery: CallbackQuery, user: User) => void;
  "command:start": (message: Message, user: User) => void;
  "command:help": (message: Message, user: User) => void;
  "command:stats": (message: Message, user: User) => void;
  "error:bot": (error: Error, context?: any) => void;
  "error:database": (error: Error, context?: any) => void;
}

export class BotEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Increase max listeners for multiple handlers
  }

  // Type-safe event emission
  emit<K extends keyof BotEvents>(
    event: K,
    ...args: Parameters<BotEvents[K]>
  ): boolean {
    return super.emit(event, ...args);
  }

  // Type-safe event listening
  on<K extends keyof BotEvents>(event: K, listener: BotEvents[K]): this {
    return super.on(event, listener);
  }

  once<K extends keyof BotEvents>(event: K, listener: BotEvents[K]): this {
    return super.once(event, listener);
  }

  off<K extends keyof BotEvents>(event: K, listener: BotEvents[K]): this {
    return super.off(event, listener);
  }
}

export const botEventEmitter = new BotEventEmitter();
