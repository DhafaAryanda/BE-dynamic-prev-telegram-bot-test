# Contoh Command Baru: /stats

## Deskripsi

Command `/stats` adalah contoh implementasi command yang menampilkan statistik bot secara real-time kepada pengguna.

## Fitur yang Ditampilkan

### 1. **Statistik User** 👥

- Total Users: Menampilkan jumlah total pengguna yang terdaftar
- Premium Users: Menampilkan jumlah pengguna premium ⭐
- Active Today: Menampilkan pengguna yang aktif dalam 24 jam terakhir
- New This Week: Menampilkan pengguna baru dalam 7 hari terakhir 🎉

### 2. **Statistik System** ⚙️

- Uptime: Menampilkan berapa lama bot sudah berjalan
- Environment: Menampilkan environment (development/production)
- Memory Usage: Menampilkan penggunaan memory dalam MB

### 3. **Metadata**

- Timestamp kapan statistik di-generate

## Implementasi

### File yang Dimodifikasi/Dibuat:

#### 1. **src/command/command-handlers.ts**

- ✅ Menambahkan registrasi command `/stats`
- ✅ Menambahkan handler `handleStats()` yang:
  - Mengambil data dari repository
  - Menghitung statistik real-time
  - Format response dengan HTML dan emoji
  - Error handling yang proper
- ✅ Update welcome message dan help message

#### 2. **src/database/repositories/user.repository.ts**

- ✅ Menambahkan method `count()` - total users
- ✅ Menambahkan method `countPremiumUsers()` - premium users
- ✅ Menambahkan method `countActiveUsers(since: Date)` - active users sejak tanggal tertentu
- ✅ Menambahkan method `countNewUsers(since: Date)` - new users sejak tanggal tertentu
- ✅ Semua method menggunakan try-catch dan DatabaseError handling

#### 3. **src/services/bot.service.ts**

- ✅ Menambahkan command `/stats` ke bot commands list
- Command ini akan muncul di menu bot Telegram

#### 4. **src/events/event-emitter.ts**

- ✅ Menambahkan event type `"command:stats"` ke interface `BotEvents`
- Memastikan type safety untuk event emission

#### 5. **src/events/event-handlers.ts**

- ✅ Menambahkan event handler untuk `"command:stats"`
- Logging setiap kali command dipanggil

## Cara Menggunakan

1. **User mengetik di Telegram**: `/stats`

2. **Bot akan merespon dengan**:

```
📊 Bot Statistics

👥 Users:
• Total Users: 150
• Premium Users: 25 ⭐
• Active Today: 45
• New This Week: +12 🎉

⚙️ System:
• Uptime: 5h 32m
• Environment: production
• Memory Usage: 125 MB

📅 Generated: 10/22/2025, 10:30:00 AM
```

## Pattern yang Digunakan

### 1. **Command Registration Pattern**

```typescript
this.botService.registerCommand({
  command: "/stats",
  description: "Show bot statistics",
  handler: this.handleStats.bind(this),
});
```

### 2. **Repository Pattern**

```typescript
// Akses data melalui repository
const totalUsers = await this.userRepository.count();
const premiumUsers = await this.userRepository.countPremiumUsers();
```

### 3. **Event Emission Pattern**

```typescript
// Emit event untuk logging/tracking
botEventEmitter.emit("command:stats", message, user);
```

### 4. **Error Handling Pattern**

```typescript
try {
  // Command logic
} catch (error) {
  logger.error("Error fetching stats", { error });
  await this.botService.sendMessage(
    message.chat.id,
    "❌ Failed to fetch statistics. Please try again later.",
    { parse_mode: "HTML" }
  );
}
```

### 5. **HTML Formatting**

```typescript
// Menggunakan HTML formatting untuk response yang lebih menarik
const statsText = `
📊 <b>Bot Statistics</b>
<b>Total Users:</b> ${totalUsers}
`;

await this.botService.sendMessage(chatId, statsText, {
  parse_mode: "HTML",
});
```

## Konsep Penting

### 1. **Async/Await**

Semua handler menggunakan async/await untuk operasi database

### 2. **Type Safety**

Menggunakan TypeScript interfaces untuk memastikan type safety

### 3. **Separation of Concerns**

- Handler: Logic untuk handle command
- Repository: Logic untuk akses database
- Service: Logic untuk komunikasi dengan Telegram
- Event: Logic untuk tracking dan logging

### 4. **Error Handling**

Setiap operasi yang bisa error dibungkus dengan try-catch

### 5. **User Feedback**

Memberikan response yang jelas kepada user, baik success maupun error

## Cara Membuat Command Baru

Ikuti pattern ini untuk membuat command baru:

1. **Register Command** di `initialize()`:

```typescript
this.botService.registerCommand({
  command: "/yourcommand",
  description: "Your description",
  handler: this.handleYourCommand.bind(this),
});
```

2. **Buat Handler Method**:

```typescript
private async handleYourCommand(message: Message): Promise<void> {
  if (!message.from) return;

  const user = await this.getUser(message.from.id);
  botEventEmitter.emit("command:yourcommand", message, user);

  try {
    // Your command logic here
    await this.botService.sendMessage(
      message.chat.id,
      "Your response here",
      { parse_mode: "HTML" }
    );
  } catch (error) {
    logger.error("Error in your command", { error });
    // Handle error
  }
}
```

3. **Update bot commands list** di `bot.service.ts`

4. **Tambahkan event type** di `event-emitter.ts`

5. **Tambahkan event handler** di `event-handlers.ts`

6. **Update help/start message** jika diperlukan

## Testing

Untuk test command ini:

1. Jalankan bot: `npm run dev`
2. Buka Telegram dan cari bot Anda
3. Ketik `/stats`
4. Verifikasi response sesuai dengan data di database

## Best Practices

✅ **DO:**

- Selalu validate `message.from`
- Gunakan try-catch untuk error handling
- Emit event untuk tracking
- Format response dengan baik (HTML/Markdown)
- Log setiap action penting
- Berikan feedback yang jelas ke user

❌ **DON'T:**

- Jangan akses database langsung dari handler (gunakan repository)
- Jangan lupa bind context saat register handler
- Jangan expose sensitive information di response
- Jangan lupa update bot commands list

## Kesimpulan

Command `/stats` adalah contoh lengkap yang mendemonstrasikan:

- ✅ Command registration
- ✅ Database access via repository
- ✅ Event emission
- ✅ Error handling
- ✅ HTML formatting
- ✅ Real-time data processing
- ✅ Type safety dengan TypeScript
- ✅ Clean code architecture

Anda bisa menggunakan pattern ini sebagai template untuk membuat command-command baru sesuai kebutuhan bot Anda!
