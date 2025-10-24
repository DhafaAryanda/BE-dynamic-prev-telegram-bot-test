# 🏗️ Multi-Role Bot Architecture

## Overview

Arsitektur ini menggunakan **Singleton Pattern** untuk bot instance yang sama, dengan **multiple roles** dan **message template factory** untuk konsistensi pesan.

## 🎯 Design Patterns

### **1. Singleton Pattern** - TelegramService

- **Satu instance** bot untuk seluruh aplikasi
- **Global access** melalui `getInstance()`
- **Thread-safe** dan memory efficient

### **2. Factory Pattern** - MessageTemplateFactory

- **Konsisten** message formatting
- **Dinamis** berdasarkan context dan data
- **Reusable** message templates

### **3. Template Method Pattern** - BaseController

- **Shared functionality** untuk semua controllers
- **Role-based access control**
- **Group management**

### **4. Strategy Pattern** - Role-based Handlers

- **Different strategies** untuk different roles
- **Runtime selection** berdasarkan user role
- **Extensible** untuk role baru

---

## 📂 Structure

```
src/
├── controllers/
│   ├── base.controller.ts          # Base controller dengan shared functionality
│   ├── request.controller.ts       # Handle request-related commands
│   └── admin.controller.ts         # Handle admin commands
├── database/
│   ├── entities/
│   │   ├── user.entity.ts          # User entity dengan roles
│   │   └── group.entity.ts         # Group entity untuk telegram groups
│   └── repositories/
│       ├── user.repository.ts      # User repository
│       └── group.repository.ts     # Group repository
├── services/
│   ├── telegram.service.ts         # Singleton TelegramService
│   └── message-template.factory.ts # Message template factory
└── types/
    └── roles.ts                    # Role constants
```

---

## 🔐 Roles

### **Role Hierarchy:**

```
SuperAdmin
    ↓
  Admin
    ↓
Approver
    ↓
Requester
```

### **Role Definitions:**

```typescript
export enum UserRole {
  SUPER_ADMIN = "superadmin", // Full access
  ADMIN = "admin", // Admin access
  APPROVER = "approver", // Can approve requests
  REQUESTER = "requester", // Can create requests
}
```

### **Role Permissions:**

| Feature           | Requester | Approver | Admin | SuperAdmin |
| ----------------- | --------- | -------- | ----- | ---------- |
| Create Request    | ✅        | ✅       | ✅    | ✅         |
| View Own Requests | ✅        | ✅       | ✅    | ✅         |
| Approve Request   | ❌        | ✅       | ✅    | ✅         |
| Reject Request    | ❌        | ✅       | ✅    | ✅         |
| View All Requests | ❌        | ✅       | ✅    | ✅         |
| Manage Users      | ❌        | ❌       | ✅    | ✅         |
| Manage Groups     | ❌        | ❌       | ✅    | ✅         |
| System Settings   | ❌        | ❌       | ❌    | ✅         |

---

## 🏢 Groups

### **Group Types:**

```typescript
export enum GroupType {
  REQUESTER = "requester", // Requester group
  APPROVER = "approver", // Approver group
  ADMIN = "admin", // Admin group
}
```

### **Group Setup:**

1. **Create Groups in Telegram:**

   - DP Requester Group
   - DP Approver Group
   - DP Admin Group

2. **Add Bot to Groups:**

   - Tambahkan bot ke setiap group
   - Set bot sebagai admin (optional)

3. **Get Group Chat IDs:**

   ```bash
   # Forward message dari grup ke @userinfobot
   # Atau gunakan bot.getChat(chatId)
   ```

4. **Insert to Database:**
   ```sql
   INSERT INTO m_group (telegram_id, name, type, created_at, created_by) VALUES
   (-1001234567890, 'DP Requester Group', 'requester', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 1),
   (-1001234567891, 'DP Approver Group', 'approver', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 1),
   (-1001234567892, 'DP Admin Group', 'admin', EXTRACT(EPOCH FROM CURRENT_TIMESTAMP), 1);
   ```

---

## 🔧 Implementation

### **1. TelegramService (Singleton)**

```typescript
// Get instance
const telegramService = TelegramService.getInstance();

// Use bot
await telegramService.sendMessage(chatId, "Hello!");
await telegramService.sendPhoto(chatId, photoUrl);
```

### **2. BaseController**

```typescript
export class YourController extends BaseController {
  async initialize(): Promise<void> {
    // Your initialization logic
  }

  async handleCommand(message: TelegramBot.Message): Promise<void> {
    // Get user
    const user = await this.getUser(message.from.id);

    // Check role
    if (!(await this.requireApprover(user, message.chat.id))) {
      return; // Unauthorized message already sent
    }

    // Your command logic here
  }
}
```

### **3. MessageTemplateFactory**

```typescript
// Get instance
const messageFactory = MessageTemplateFactory.getInstance();

// Use templates
const message = messageFactory.requestConfirmation(message, messageData);
await this.sendMessage(chatId, message.text, message.options);

const approval = messageFactory.approvalRequestNew(chatId, messageData);
await this.sendMessage(approval.chatId, approval.text, approval.options);
```

---

## 📝 Usage Examples

### **Example 1: Create Request**

```typescript
// User mengirim: "/rqopen migrasi john,doe 2024-01-01 08:00 2024-01-01 10:00 WIB"

const messageData: MessageData = {
  taskId: "TASK-123",
  requester: {
    firstName: "John",
    username: "john_doe",
  },
  request: {
    activity: "migrasi",
    startedAt: "1704067200", // Unix timestamp
    endedAt: "1704074400",
    timezone: "WIB",
  },
  activity: {
    name: "Database Migration",
  },
};

// Send confirmation to requester
const confirmation = this.messageFactory.requestConfirmation(
  message,
  messageData
);
await this.sendMessage(
  message.chat.id,
  confirmation.text,
  confirmation.options
);

// Send to approver group
const approval = this.messageFactory.approvalRequestNew(
  this.approverGroupId,
  messageData
);
await this.sendMessage(approval.chatId, approval.text, approval.options);
```

### **Example 2: Role-based Access**

```typescript
async handleAdminCommand(message: TelegramBot.Message): Promise<void> {
  const user = await this.getUser(message.from.id);

  // Check if user is admin
  if (!(await this.requireAdmin(user, message.chat.id))) {
    return; // Unauthorized message sent automatically
  }

  // Admin command logic here
}
```

### **Example 3: Group-specific Logic**

```typescript
async handleMessage(message: TelegramBot.Message): Promise<void> {
  // Check if message is from a group
  if (!this.isChatFromGroup(message.chat.id)) {
    return; // Ignore non-group messages
  }

  // Check specific group
  if (this.isChatFromApproverGroup(message.chat.id)) {
    // Handle approver group logic
  } else if (this.isChatFromAdminGroup(message.chat.id)) {
    // Handle admin group logic
  }
}
```

---

## 🎨 Message Template Structure

```typescript
MessageTemplateFactory.send = {
  // Normal messages
  requestConfirmation(message, messageData)
  approvalRequestNew(chatId, messageData)
  approvalReminderFiveMinutes(chatId, messageData, duties)
  approvalReminderTenMinutes(chatId, messageData, duties)
  iseSchedulingSuccess(chatId, request)
  iseSchedulingFailed(chatId, request)

  // Dismissable messages
  botStart(message, user)
  help(user)

  // Utility messages
  error(message, details)
  success(message, details)
  unauthorized(requiredRole)
}
```

---

## 🚀 Quick Start

### **Step 1: Update Database Schema**

```bash
# Add role column to users table
# Add m_group table
```

### **Step 2: Create Groups**

1. Create 3 groups in Telegram
2. Add bot to groups
3. Get chat IDs
4. Insert to database

### **Step 3: Create Controller**

```typescript
import { BaseController } from "./base.controller";

export class YourController extends BaseController {
  async initialize(): Promise<void> {
    // Setup your commands
  }

  async handleYourCommand(message: TelegramBot.Message): Promise<void> {
    const user = await this.getUser(message.from.id);

    // Check role
    if (!(await this.requireRole(user, UserRole.REQUESTER, message.chat.id))) {
      return;
    }

    // Your logic here
  }
}
```

### **Step 4: Register Controller**

```typescript
// In command-handlers.ts or similar
const requestController = new RequestController();
await requestController.initialize();

this.botService.registerCommand({
  command: "/rqopen",
  description: "Create new request",
  handler: (msg) => requestController.handleRequestOpen(msg),
});
```

---

## 🔍 Benefits

### **Singleton Pattern for Bot:**

- ✅ **Memory efficient** - satu instance untuk semua
- ✅ **Consistent state** - tidak ada konflik instance
- ✅ **Easy access** - `getInstance()` dari mana saja
- ✅ **Thread-safe** - aman untuk concurrent access

### **Message Template Factory:**

- ✅ **Consistent formatting** - semua message format sama
- ✅ **Easy to maintain** - update di satu tempat
- ✅ **Dynamic content** - berdasarkan context dan data
- ✅ **Type-safe** - TypeScript validation

### **BaseController:**

- ✅ **Code reusability** - shared functionality
- ✅ **Role-based access** - automatic permission check
- ✅ **Group management** - easy group operations
- ✅ **Consistent API** - same methods untuk semua controllers

### **Role-based System:**

- ✅ **Flexible permissions** - easy to add new roles
- ✅ **Security** - automatic role checking
- ✅ **Auditable** - track who did what
- ✅ **Scalable** - support many users dan roles

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User Request                            │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                  WebhookServer                             │
│              (Receive Telegram Update)                     │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                TelegramService (Singleton)                 │
│              - Single bot instance                         │
│              - Shared across all controllers               │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                   BaseController                           │
│              - Role checking                               │
│              - Group management                            │
│              - Common functionality                        │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              RequestController / AdminController           │
│              - Specific command logic                      │
│              - Use MessageTemplateFactory                  │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│            MessageTemplateFactory (Singleton)              │
│              - Consistent message formatting               │
│              - Dynamic content                             │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              Repository Layer                              │
│              - UserRepository                              │
│              - GroupRepository                             │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              Database (PostgreSQL)                         │
│              - users table (with roles)                    │
│              - m_group table                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Best Practices

1. **Always use Singleton instances:**

   ```typescript
   // ✅ CORRECT
   const telegramService = TelegramService.getInstance();

   // ❌ WRONG
   const telegramService = new TelegramService();
   ```

2. **Always extend BaseController:**

   ```typescript
   // ✅ CORRECT
   export class YourController extends BaseController

   // ❌ WRONG
   export class YourController // No inheritance
   ```

3. **Always check roles:**

   ```typescript
   // ✅ CORRECT
   if (!(await this.requireAdmin(user, chatId))) return;

   // ❌ WRONG
   // No role checking
   ```

4. **Always use MessageTemplateFactory:**

   ```typescript
   // ✅ CORRECT
   const message = this.messageFactory.success("Done!");

   // ❌ WRONG
   const message = "✅ Success\nDone!"; // Manual formatting
   ```

---

**Happy coding! 🚀**

Arsitektur ini memberikan foundation yang solid untuk bot multi-role dengan message yang konsisten dan maintainable code!
