import { DataSource } from "typeorm";
import { User } from "./entities/user.entity";
import { config } from "../config/config";
import { logger } from "../utils/logger";
import { DatabaseError } from "../utils/error-handler";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [User],
  migrations: ["src/database/migrations/*.ts"],
  subscribers: ["src/database/subscribers/*.ts"],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info("✅ Database connection established successfully", {
      host: config.database.host,
      database: config.database.database,
    });
  } catch (error) {
    logger.error("❌ Error during database initialization", { error });
    throw new DatabaseError("Failed to initialize database connection");
  }
};
