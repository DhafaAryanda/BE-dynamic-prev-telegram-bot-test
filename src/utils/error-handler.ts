import { logger } from "./logger";
import { botEventEmitter } from "../events/event-emitter";

/**
 * Custom error classes for better error handling
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, true);
    this.name = "DatabaseError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, true);
    this.name = "ValidationError";
  }
}

export class BotError extends AppError {
  constructor(message: string) {
    super(message, 500, true);
    this.name = "BotError";
  }
}

/**
 * Centralized error handler
 */
export class ErrorHandler {
  static handle(error: Error | AppError, context?: any): void {
    if (error instanceof AppError) {
      if (error.isOperational) {
        logger.warn(error.message, { context, stack: error.stack });
      } else {
        logger.error(error.message, { context, stack: error.stack });
      }
    } else {
      logger.error(error.message, { context, stack: error.stack });
    }

    // Emit error event
    if (error instanceof DatabaseError) {
      botEventEmitter.emit("error:database", error, context);
    } else {
      botEventEmitter.emit("error:bot", error, context);
    }
  }

  static async handleAsync(
    fn: () => Promise<any>,
    context?: string
  ): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      ErrorHandler.handle(error as Error, { context });
      throw error;
    }
  }
}

/**
 * Async wrapper for better error handling
 */
export function asyncHandler(
  fn: (...args: any[]) => Promise<any>
): (...args: any[]) => Promise<any> {
  return async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.handle(error as Error, { args });
      throw error;
    }
  };
}
