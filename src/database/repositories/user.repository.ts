import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { DatabaseError } from "../../utils/error-handler";

/**
 * User Repository - Industry standard repository pattern
 */
export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      throw new DatabaseError(`Failed to find user by id: ${id}`);
    }
  }

  async findByTelegramId(telegramId: number): Promise<User | null> {
    try {
      return await this.repository.findOne({ where: { telegramId } });
    } catch (error) {
      throw new DatabaseError(
        `Failed to find user by telegram id: ${telegramId}`
      );
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const user = this.repository.create(userData);
      return await this.repository.save(user);
    } catch (error) {
      throw new DatabaseError("Failed to create user");
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      await this.repository.update(id, userData);
      const user = await this.findById(id);
      if (!user) {
        throw new DatabaseError(`User not found: ${id}`);
      }
      return user;
    } catch (error) {
      throw new DatabaseError(`Failed to update user: ${id}`);
    }
  }

  async save(user: User): Promise<User> {
    try {
      return await this.repository.save(user);
    } catch (error) {
      throw new DatabaseError("Failed to save user");
    }
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
  }): Promise<[User[], number]> {
    try {
      return await this.repository.findAndCount({
        skip: options?.skip || 0,
        take: options?.take || 10,
        order: { createdAt: "DESC" },
      });
    } catch (error) {
      throw new DatabaseError("Failed to fetch users");
    }
  }

  async updateLastActivity(telegramId: number): Promise<void> {
    try {
      await this.repository.update(
        { telegramId },
        { lastActivity: new Date() }
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to update last activity for user: ${telegramId}`
      );
    }
  }

  async countActiveUsers(days: number = 7): Promise<number> {
    try {
      const date = new Date();
      date.setDate(date.getDate() - days);

      return await this.repository
        .createQueryBuilder("user")
        .where("user.lastActivity >= :date", { date })
        .andWhere("user.isActive = :isActive", { isActive: true })
        .getCount();
    } catch (error) {
      throw new DatabaseError("Failed to count active users");
    }
  }
}
