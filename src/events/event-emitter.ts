import { EventEmitter } from "events";
import { Message, CallbackQuery } from "node-telegram-bot-api";

export interface BotEvents {
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
