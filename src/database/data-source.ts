import { DataSource } from "typeorm";

import { config } from "../config/config";
import { logger } from "../utils/logger";
import { DatabaseError } from "../utils/error-handler";

// Import all entities explicitly
import { UserEntity } from "./entities/user.entity";
import { roleEntity } from "./entities/role.entity";
import { permissionEntity } from "./entities/permission.entity";
import { OrganizationEntity } from "./entities/organization.entity";
import { PositionEntity } from "./entities/position.entity";
import { AppEntity } from "./entities/app.entity";
import { AppRoleEntity } from "./entities/app-role.entity";
import { AppDomainEntity } from "./entities/app-domain.entity";
import { AppAdminEntity } from "./entities/app-admin.entity";
import { AppFlowEntity } from "./entities/app-flow.entity";
import { AppApiEntity } from "./entities/app-api.entity";
import { AppApiAuthEntity } from "./entities/app-api-auth.entity";
import { AppApiSchemeEntity } from "./entities/app-api-scheme.entity";
import { RequestEntity } from "./entities/request.entity";
import { RequestTypeEntity } from "./entities/request-type.entity";
import { RequestStatusEntity } from "./entities/request-status.entity";
import { RequestAppEntity } from "./entities/request-app.entity";
import { RequestTaskEntity } from "./entities/request-task.entity";
import { RequestTaskProcessEntity } from "./entities/request-task-process.entity";
import { RequestTaskProcessHistoryEntity } from "./entities/request-task-process-history.entity";
import { RequestAdminStatusEntity } from "./entities/request-admin-status.entity";
import { RegisteredUserEntity } from "./entities/registered-user.entity";
import { UserDeviceEntity } from "./entities/user-device.entity";
import { UserVendorEntity } from "./entities/user-vendor.entity";
import { DirectSupervisorEntity } from "./entities/direct-supervisor.entity";
import { FlowProcessOwnerEntity } from "./entities/flow-process-owner.entity";
import { AppProcessOwnerEntity } from "./entities/app-process-owner.entity";
import { AppRoleTemplateEntity } from "./entities/app-role-template.entity";
import { AppDomainTemplateEntity } from "./entities/app-domain-template.entity";
import { NotificationEntity } from "./entities/notification.entity";
import { NotificationChannelEntity } from "./entities/notification-channel.entity";
import { ReviewEntity } from "./entities/review.entity";
import { ReviewEventEntity } from "./entities/review-event.entity";
import { ReviewHistoryEntity } from "./entities/review-history.entity";
import { ReviewImportUserappEntity } from "./entities/review-import-userapp.entity";
import { ReviewReportEntity } from "./entities/review-report.entity";
import { ReviewTaskEntity } from "./entities/review-task.entity";
import { ReviewCodeEntity } from "./entities/review-code.entity";
import { dprivilegeActivityEntity } from "./entities/dprivilege-activity.entity";
import { dprivilegeDetailsEntity } from "./entities/dprivilege-details.entity";
import { dprivilegeDutiesEntity } from "./entities/dprivilege-duties.entity";
import { dprivilegeTeleGroupEntity } from "./entities/dprivilege-tele-group.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [
    UserEntity,
    roleEntity,
    permissionEntity,
    OrganizationEntity,
    PositionEntity,
    AppEntity,
    AppRoleEntity,
    AppDomainEntity,
    AppAdminEntity,
    AppFlowEntity,
    AppApiEntity,
    AppApiAuthEntity,
    AppApiSchemeEntity,
    RequestEntity,
    RequestTypeEntity,
    RequestStatusEntity,
    RequestAppEntity,
    RequestTaskEntity,
    RequestTaskProcessEntity,
    RequestTaskProcessHistoryEntity,
    RequestAdminStatusEntity,
    RegisteredUserEntity,
    UserDeviceEntity,
    UserVendorEntity,
    DirectSupervisorEntity,
    FlowProcessOwnerEntity,
    AppProcessOwnerEntity,
    AppRoleTemplateEntity,
    AppDomainTemplateEntity,
    NotificationEntity,
    NotificationChannelEntity,
    ReviewEntity,
    ReviewEventEntity,
    ReviewHistoryEntity,
    ReviewImportUserappEntity,
    ReviewReportEntity,
    ReviewTaskEntity,
    ReviewCodeEntity,
    dprivilegeActivityEntity,
    dprivilegeDetailsEntity,
    dprivilegeDutiesEntity,
    dprivilegeTeleGroupEntity,
  ],
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
