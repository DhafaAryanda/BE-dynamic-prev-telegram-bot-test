# 🚀 Multi-Role Bot Setup Guide

## Overview

Panduan lengkap setup bot Telegram dengan **Singleton Pattern**, **multiple roles**, dan **message template factory**.

---

## 📋 Prerequisites

- ✅ PostgreSQL database running
- ✅ Node.js & npm installed
- ✅ Telegram bot token
- ✅ 3 Telegram groups created

---

## 🔧 Setup Steps

### **Step 1: Database Setup**

#### **Option A: Automatic (TypeORM Sync)**

Set di `.env`:

```env
DATABASE_SYNCHRONIZE=true
```

Jalankan bot, TypeORM akan auto-create tables.

#### **Option B: Manual (SQL Script)**

Jalankan script SQL:

```bash
psql -U postgres -d telegram_bot_db -f setup-database.sql
```

**Atau manual:**

```bash
psql -U postgres -d telegram_bot_db

# Copy paste isi setup-database.sql
```

---

### **Step 2: Create Telegram Groups**

1. **Buka Telegram**
2. **Create 3 groups:**

   - `DP Requester Group`
   - `DP Approver Group`
   - `DP Admin Group`

3. **Add bot ke setiap group:**
   - Search bot Anda
   - Add to group
   - (Optional) Set bot sebagai admin

---

### **Step 3: Get Group Chat IDs**

#### **Option A: Via @userinfobot**

1. Forward message dari group ke `@userinfobot`
2. Bot akan reply dengan chat info including ID

#### **Option B: Via Code**

Tambahkan temporary code:

```typescript
this.bot.on("message", (msg) => {
  console.log("Chat ID:", msg.chat.id);
  console.log("Chat Type:", msg.chat.type);
  console.log("Chat Title:", msg.chat.title);
});
```

Send message di group, lihat console.

#### **Option C: Via Telegram API**

```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

Look for "chat":{"id": ...}

---

### **Step 4: Update Database with Group IDs**

Edit `setup-database.sql` atau jalankan SQL:

```sql
-- Ganti dengan chat ID Anda yang sebenarnya
UPDATE m_group SET telegram_id = -1001234567890 WHERE type = 'requester';
UPDATE m_group SET telegram_id = -1001234567891 WHERE type = 'approver';
UPDATE m_group SET telegram_id = -1001234567892 WHERE type = 'admin';

-- Atau insert jika belum ada
INSERT INTO m_group (telegram_id, name, type) VALUES
(-1001234567890, 'DP Requester Group', 'requester'),
(-1001234567891, 'DP Approver Group', 'approver'),
(-1001234567892, 'DP Admin Group', 'admin');
```

---

### **Step 5: Set User Roles**

#### **Default: All new users are 'requester'**

#### **Set specific user as Admin:**

```sql
-- Ganti dengan Telegram ID Anda
UPDATE users
SET role = 'superadmin'
WHERE telegram_id = 123456789;

-- Atau insert baru
INSERT INTO users (telegram_id, first_name, username, role) VALUES
(123456789, 'Your Name', 'your_username', 'superadmin');
```

#### **Get your Telegram ID:**

- Send message to `@userinfobot`
- Atau lihat dari database setelah `/start`

---

### **Step 6: Test Bot**

#### **1. Start Bot:**

```bash
npm run dev
```

#### **2. Test in Private Chat:**

```
/start
```

Should see welcome message with your role.

#### **3. Test Request Creation (Requester):**

```
/rqopen migrasi john,doe 2024-01-01 08:00 2024-01-01 10:00 WIB
```

Should:

- ✅ Send confirmation to you
- ✅ Send approval request to Approver Group

#### **4. Test in Groups:**

**In Requester Group:**

- Send message, bot should respond based on context

**In Approver Group:**

- See approval requests
- Click "Approve" or "Reject"

**In Admin Group:**

- Admin-specific functionality

---

## 🎯 Role Management

### **Change User Role:**

```sql
-- Set user as admin
UPDATE users
SET role = 'admin'
WHERE telegram_id = 123456789;

-- Set user as approver
UPDATE users
SET role = 'approver'
WHERE telegram_id = 987654321;

-- Set user as requester (default)
UPDATE users
SET role = 'requester'
WHERE telegram_id = 111222333;
```

### **Check User Roles:**

```sql
SELECT telegram_id, first_name, username, role
FROM users
ORDER BY role, created_at DESC;
```

### **Count Users by Role:**

```sql
SELECT role, COUNT(*) as count
FROM users
GROUP BY role
ORDER BY count DESC;
```

---

## 📝 Usage Examples

### **Example 1: Create Request**

**User sends:**

```
/rqopen migrasi john,doe 2024-01-01 08:00 2024-01-01 10:00 WIB
```

**Bot behavior:**

1. Check user role (must be requester)
2. Parse command arguments
3. Create task ID
4. Send confirmation to user
5. Send approval request to Approver Group

**User sees:**

```
✅ Request Confirmation

Your request has been submitted successfully!

Task ID: TASK-1234567890
Activity: migrasi
Start Time: 1/1/2024, 8:00:00 AM WIB
End Time: 1/1/2024, 10:00:00 AM WIB

Your request is now waiting for approval.
```

**Approver Group sees:**

```
🔔 New Approval Request

Task ID: TASK-1234567890
Requester: John @john_doe
Activity: Database Migration
Start Time: 1/1/2024, 8:00:00 AM WIB
End Time: 1/1/2024, 10:00:00 AM WIB

Please review and approve this request.

[✅ Approve] [❌ Reject]
[📝 Details]
```

---

### **Example 2: Approve Request**

**Approver clicks "Approve":**

**Bot behavior:**

1. Check if user is approver
2. Update request status
3. Send notification to requester
4. Update message in Approver Group
5. Send to Admin Group for scheduling

---

### **Example 3: Role-based Access**

**Requester tries admin command:**

```
/stats
```

**Bot responds:**

```
🚫 Unauthorized Access

You don't have permission to perform this action.

Required Role: admin

Please contact your administrator if you believe this is an error.
```

---

## 🔍 Troubleshooting

### **Issue 1: Bot tidak respond di group**

**Solusi:**

1. Check bot adalah member di group
2. Check group ID sudah correct di database
3. Check logs untuk error

```sql
SELECT * FROM m_group;
```

### **Issue 2: Unauthorized access**

**Solusi:**

1. Check user role di database

```sql
SELECT telegram_id, first_name, username, role
FROM users
WHERE telegram_id = YOUR_TELEGRAM_ID;
```

2. Update role jika perlu

```sql
UPDATE users SET role = 'admin' WHERE telegram_id = YOUR_TELEGRAM_ID;
```

### **Issue 3: Group ID tidak ditemukan**

**Solusi:**

1. Verify group IDs di database
2. Forward message dari group ke @userinfobot
3. Update database dengan correct IDs

### **Issue 4: Message template tidak muncul**

**Solusi:**

1. Check MessageTemplateFactory singleton
2. Check parse_mode: "HTML"
3. Check error logs

---

## 🎨 Customization

### **Add New Role:**

1. **Update enum:**

```typescript
export enum UserRole {
  SUPER_ADMIN = "superadmin",
  ADMIN = "admin",
  APPROVER = "approver",
  REQUESTER = "requester",
  VIEWER = "viewer", // ← New role
}
```

2. **Update database:**

```sql
ALTER TYPE user_role ADD VALUE 'viewer';
```

3. **Add role check method:**

```typescript
isViewer(): boolean {
  return this.role === UserRole.VIEWER;
}
```

### **Add New Group:**

1. **Update enum:**

```typescript
export enum GroupType {
  REQUESTER = "requester",
  APPROVER = "approver",
  ADMIN = "admin",
  MONITORING = "monitoring", // ← New group
}
```

2. **Update database:**

```sql
ALTER TYPE group_type ADD VALUE 'monitoring';
INSERT INTO m_group (telegram_id, name, type) VALUES
(-1001234567893, 'DP Monitoring Group', 'monitoring');
```

3. **Add group ID to BaseController:**

```typescript
protected monitoringGroupId: number = 0;

// In initializeGroupIds()
const monitoringGroup = await this.groupRepository.findByType(GroupType.MONITORING);
this.monitoringGroupId = monitoringGroup.telegramId;
```

### **Add New Message Template:**

```typescript
// In MessageTemplateFactory
customMessage(
  chatId: number,
  data: any
): { chatId: number; text: string; options: TelegramBot.SendMessageOptions } {
  const text = `
🎯 <b>Custom Message</b>

<b>Data:</b> ${data.someField}

Your custom content here.
  `.trim();

  return {
    chatId,
    text,
    options: {
      parse_mode: "HTML",
    },
  };
}
```

---

## 📊 Monitoring

### **Check Bot Status:**

```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Users by role
SELECT role, COUNT(*) as count
FROM users
GROUP BY role;

-- Active users (last 24 hours)
SELECT COUNT(*)
FROM users
WHERE last_activity > NOW() - INTERVAL '24 hours';

-- Groups
SELECT * FROM m_group WHERE is_active = true;
```

### **Check Logs:**

```bash
# Bot logs
npm run dev

# Database logs (if enabled)
# Check PostgreSQL logs
```

---

## 🚀 Deployment

### **Production Checklist:**

- [ ] Set `DATABASE_SYNCHRONIZE=false`
- [ ] Use database migrations instead of sync
- [ ] Set proper user roles
- [ ] Verify all group IDs
- [ ] Test all commands
- [ ] Set up monitoring
- [ ] Configure error alerting
- [ ] Backup database

---

## 📚 Resources

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [TypeORM Documentation](https://typeorm.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🆘 Support

Jika ada masalah:

1. Check logs
2. Check database
3. Check group IDs
4. Check user roles
5. Read documentation
6. Contact administrator

---

**Happy coding! 🚀**

Multi-role bot architecture memberikan foundation yang solid untuk bot yang scalable dan maintainable!
