import dotenv from "dotenv";

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || "",
    webhookUrl: process.env.TELEGRAM_WEBHOOK_URL || "",
    webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "telegram_bot_db",
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    logging: process.env.TYPEORM_LOGGING === "true",
  },
};

// Validation
if (!config.telegram.botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}
