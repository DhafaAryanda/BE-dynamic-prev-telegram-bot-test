# Command `/user` - User List Guide

## Deskripsi

Command `/user` digunakan untuk mengambil dan menampilkan daftar semua user dari database PostgreSQL menggunakan TypeORM.

## Cara Penggunaan

### 1. Kirim Command ke Bot

Kirim pesan `/user` ke bot Telegram Anda.

### 2. Response Bot

Bot akan menampilkan daftar user dengan format:

```
👥 Users List

📊 Total: 10 user(s)
━━━━━━━━━━━━━━━━━━━━

1. John Doe
   👤 Username: @johndoe
   📧 Email: john@example.com
   🆔 ID: 1
   📱 Telegram ID: 123456789
   ✅ Active
   📅 Created: 12/25/2023

2. Jane Smith
   👤 Username: @janesmith
   📧 Email: jane@example.com
   🆔 ID: 2
   📱 Telegram ID: Not linked
   ❌ Inactive
   📅 Created: 12/26/2023

...
```

## Fitur

### ✅ Yang Ditampilkan:

- **Nama lengkap** user
- **Username** (handle Telegram format)
- **Email** address
- **User ID** dari database
- **Telegram ID** (jika sudah ter-link)
- **Status aktif/tidak aktif**
- **Tanggal pembuatan** akun

### 🔒 Keamanan:

- **Password tidak ditampilkan** (di-exclude dari query)
- **Limit 10 users** untuk menghindari pesan terlalu panjang
- **Error handling** yang baik dengan pesan user-friendly

## Technical Details

### File yang Dimodifikasi:

#### 1. `src/command/command-handlers.ts`

```typescript
// Import dependencies
import { AppDataSource } from "../database/data-source";
import { UserEntity } from "../database/entities/user.entity";

// Register command
this.botService.registerCommand({
  command: "/user",
  description: "Get all users from database",
  handler: this.handleUser.bind(this),
});

// Handler implementation
private async handleUser(message: Message): Promise<void> {
  const userRepository = AppDataSource.getRepository(UserEntity);
  const users = await userRepository.find({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      isActive: true,
      telegramId: true,
      createdAt: true,
    },
    take: 10,
  });
  // ... formatting and sending message
}
```

#### 2. `src/services/bot.service.ts`

```typescript
// Add command to bot menu
private async setBotCommands(): Promise<void> {
  const commands = [
    // ... other commands
    { command: "user", description: "Get all users from database" },
  ];
  await this.bot.setMyCommands(commands);
}
```

### Database Query:

```typescript
const users = await userRepository.find({
  select: {
    id: true,
    username: true,
    name: true,
    email: true,
    isActive: true,
    telegramId: true,
    createdAt: true,
  },
  take: 10, // Limit to 10 users
});
```

## Error Handling

### 1. No Users Found

```
❌ No users found in database.
```

### 2. Database Error

```
❌ Error fetching users from database. Please try again later.
```

### 3. Logging

Semua request dan error di-log menggunakan logger:

```typescript
logger.info("User list requested", {
  requestedBy: message.from.id,
  totalUsers: users.length,
});

logger.error("Error fetching users", { error });
```

## Kustomisasi

### Mengubah Limit User

Ubah nilai `take` di query:

```typescript
take: 20, // Tampilkan 20 users
```

### Menambah Field

Tambahkan field di `select`:

```typescript
select: {
  // ... existing fields
  phoneNo: true,
  isLdap: true,
}
```

### Pagination (Future Enhancement)

Untuk menambahkan pagination, Anda bisa:

1. Tambahkan parameter `skip` dan `take`
2. Gunakan inline keyboard untuk "Next" dan "Previous"
3. Store current page di callback_data

## Testing

### Prerequisites:

1. Database harus sudah terkoneksi
2. Table `m_user` harus ada dan terisi
3. Bot harus running (polling atau webhook)

### Test Steps:

1. Kirim `/user` ke bot
2. Verifikasi response menampilkan data yang benar
3. Test dengan database kosong
4. Test error handling (disconnect database)

## Dependencies Used:

- ✅ TypeORM - ORM untuk database operations
- ✅ node-telegram-bot-api - Telegram bot library
- ✅ PostgreSQL - Database

## Notes:

- Command ini menggunakan **HTML parse mode** untuk formatting
- Password field di-exclude secara otomatis karena menggunakan `@Exclude()` decorator
- Best practice: Tambahkan authorization check untuk production use
