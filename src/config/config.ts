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
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "safir_be",
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === "true",
  },
};

// Validation
if (!config.telegram.botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}
