import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { Message, CallbackQuery } from "node-telegram-bot-api";

export class MessageValidator {
  static async validateMessage(message: Message): Promise<ValidationError[]> {
    const messageDto = plainToClass(MessageDto, message);
    return validate(messageDto);
  }

  static async validateCallbackQuery(
    callbackQuery: CallbackQuery
  ): Promise<ValidationError[]> {
    const callbackDto = plainToClass(CallbackQueryDto, callbackQuery);
    return validate(callbackDto);
  }

  static formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => Object.values(error.constraints || {}).join(", "))
      .join("; ");
  }
}

// DTOs for validation
export class MessageDto {
  message_id!: number;
  from!: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat!: {
    id: number;
    type: string;
  };
  date!: number;
  text?: string;
}

export class CallbackQueryDto {
  id!: string;
  from!: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  message?: Message;
  data?: string;
}

// Custom validators
export class TelegramValidators {
  static isValidTelegramId(id: number): boolean {
    return Number.isInteger(id) && id > 0;
  }

  static isValidChatId(id: number): boolean {
    return Number.isInteger(id);
  }

  static isValidMessageText(text: string, maxLength: number = 4096): boolean {
    return typeof text === "string" && text.length <= maxLength;
  }

  static isValidCallbackData(data: string, maxLength: number = 64): boolean {
    return typeof data === "string" && data.length <= maxLength;
  }

  static sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .trim()
      .substring(0, 4096); // Limit length
  }
}
