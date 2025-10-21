/**
 * Logger utility with different log levels
 * Industry standard logging service
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel =
      process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  error(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.ERROR) {
      console.error(this.formatMessage("ERROR", message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.WARN) {
      console.warn(this.formatMessage("WARN", message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.INFO) {
      console.log(this.formatMessage("INFO", message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.logLevel >= LogLevel.DEBUG) {
      console.log(this.formatMessage("DEBUG", message, meta));
    }
  }

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
}

export const logger = Logger.getInstance();
