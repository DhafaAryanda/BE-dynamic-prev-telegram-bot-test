# 🔧 Webhook Setup Guide - Troubleshooting

## ❌ Masalah: Bot Tidak Merespon & Tidak Ada Log

Jika bot Anda tidak merespon dan tidak ada log yang muncul, kemungkinan besar **webhook belum di-set ke Telegram**.

## 📋 Prerequisites

1. ✅ Ngrok terinstall dan running
2. ✅ File `.env` sudah dikonfigurasi
3. ✅ Bot token sudah valid
4. ✅ Server webhook sudah running

---

## 🚀 Quick Setup (3 Langkah)

### 1️⃣ Jalankan Ngrok

```bash
ngrok http 3000
```

Anda akan mendapat URL seperti:

```
Forwarding    https://xxxx-xx-xx-xxx-xx.ngrok-free.app -> http://localhost:3000
```

**Copy URL tersebut!**

### 2️⃣ Jalankan Bot

```bash
npm run dev
```

Pastikan bot running dan mendengarkan di port 3000 (atau port yang Anda set).

### 3️⃣ Set Webhook

Gunakan helper script yang sudah disediakan:

```bash
node setup-webhook.js https://xxxx-xx-xx-xxx-xx.ngrok-free.app
```

Ganti URL dengan ngrok URL Anda!

✅ **Done!** Bot Anda sekarang bisa menerima message.

---

## 🔍 Verifikasi Setup

### Check Webhook Status

```bash
node check-webhook.js
```

Output yang benar:

```
📊 Webhook Information:

   URL: https://xxxx.ngrok-free.app/webhook
   Has Custom Certificate: false
   Pending Update Count: 0

✅ No webhook errors detected!
✅ Webhook is configured!
```

### Test Bot di Telegram

1. Buka Telegram
2. Cari bot Anda
3. Kirim command: `/start`
4. Bot harus merespon!

### Check Logs di Console

Saat Anda kirim `/start`, Anda harus melihat log seperti:

```
📡 POST /webhook
💬 Message from @username: /start...
🚀 Start command from @username
✅ Response sent
```

---

## ⚠️ Troubleshooting Common Issues

### Issue 1: Webhook URL Invalid

**Error**: `Invalid webhook URL`

**Solusi**:

- Pastikan URL ngrok masih aktif (ngrok URLs expire!)
- URL harus HTTPS (ngrok sudah provide HTTPS)
- URL tidak boleh ada trailing slash di akhir base URL

```bash
# ✅ BENAR
https://xxxx.ngrok-free.app

# ❌ SALAH
https://xxxx.ngrok-free.app/
http://xxxx.ngrok-free.app  # harus HTTPS
```

### Issue 2: Webhook Set Tapi Tidak Ada Response

**Cek webhook info**:

```bash
node check-webhook.js
```

Jika ada `last_error_message`:

#### Error: "Connection refused"

- ✅ Pastikan bot server running
- ✅ Check port number (3000)
- ✅ Restart bot: `npm run dev`

#### Error: "Wrong response from the webhook: 404"

- ✅ Check endpoint di `webhook.server.ts` (harus `/webhook`)
- ✅ Pastikan route registered correctly

#### Error: "Secret token mismatch"

- ✅ Check `TELEGRAM_WEBHOOK_SECRET` di `.env`
- ✅ Pastikan sama dengan yang di-set saat setup webhook

### Issue 3: Ngrok Expired

Ngrok free tier expire setelah 2 jam. Jika URL berubah:

1. Copy ngrok URL baru
2. Set ulang webhook:

```bash
node setup-webhook.js https://new-url.ngrok-free.app
```

### Issue 4: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3000`

**Solusi**:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Atau ganti port di .env
PORT=3001
```

### Issue 5: Bot Token Invalid

**Error**: `Unauthorized` atau `Invalid bot token`

**Solusi**:

1. Check `.env` file, pastikan `TELEGRAM_BOT_TOKEN` benar
2. Dapatkan token baru dari [@BotFather](https://t.me/BotFather)
3. Update `.env` dan restart bot

---

## 🛠️ Helper Scripts

### Setup Webhook

```bash
node setup-webhook.js <ngrok-url>
```

Set webhook URL ke Telegram dengan ngrok URL Anda.

### Check Webhook Status

```bash
node check-webhook.js
```

Cek status webhook, error messages, pending updates, dll.

### Delete Webhook

```bash
node delete-webhook.js
```

Hapus webhook dari Telegram (untuk reset atau switch ke polling).

---

## 📝 Configuration Checklist

Pastikan file `.env` Anda memiliki:

```env
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://your-ngrok-url.ngrok-free.app
TELEGRAM_WEBHOOK_SECRET=any_random_secret_string_123

# Server
PORT=3000
NODE_ENV=development

# Database (optional for basic testing)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=telegram_bot_db
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=false
```

---

## 🔄 Workflow Lengkap

```
1. Start Ngrok
   │
   ├─→ ngrok http 3000
   │
2. Copy Ngrok URL
   │
   ├─→ https://xxxx.ngrok-free.app
   │
3. Update .env
   │
   ├─→ TELEGRAM_WEBHOOK_URL=https://xxxx.ngrok-free.app
   │
4. Start Bot
   │
   ├─→ npm run dev
   │
5. Set Webhook
   │
   ├─→ node setup-webhook.js https://xxxx.ngrok-free.app
   │
6. Verify
   │
   ├─→ node check-webhook.js
   │
7. Test Bot
   │
   └─→ Send /start di Telegram
```

---

## 💡 Tips & Best Practices

### For Development

1. **Keep ngrok running** - Jangan close terminal ngrok
2. **Use consistent port** - Selalu gunakan port yang sama (misal 3000)
3. **Watch logs** - Monitor console untuk lihat request masuk
4. **Check webhook regularly** - Run `node check-webhook.js` jika ada masalah

### For Production

1. **Use proper domain** - Jangan pakai ngrok, gunakan domain sendiri
2. **Use HTTPS** - Wajib untuk webhook
3. **Set webhook secret** - Untuk keamanan
4. **Monitor webhook errors** - Setup alerting untuk webhook failures

---

## 🆘 Still Not Working?

### Check Everything:

```bash
# 1. Check if ngrok is running
curl https://your-ngrok-url.ngrok-free.app/health

# 2. Check if bot server is running locally
curl http://localhost:3000/health

# 3. Check webhook status
node check-webhook.js

# 4. Check bot logs
# Look at your terminal where you ran "npm run dev"
```

### Enable Debug Logs

Update `.env`:

```env
NODE_ENV=development
DATABASE_LOGGING=true
```

Restart bot dan perhatikan semua log yang muncul.

### Manual Webhook Test

Test webhook endpoint langsung:

```bash
curl -X POST http://localhost:3000/webhook \
  -H "Content-Type: application/json" \
  -H "X-Telegram-Bot-Api-Secret-Token: your_secret" \
  -d '{
    "update_id": 123456789,
    "message": {
      "message_id": 1,
      "from": {
        "id": 123456,
        "is_bot": false,
        "first_name": "Test"
      },
      "chat": {
        "id": 123456,
        "type": "private"
      },
      "date": 1234567890,
      "text": "/start"
    }
  }'
```

Jika ini berhasil tapi message dari Telegram tidak, berarti masalah di webhook setup ke Telegram.

---

## 📚 Additional Resources

- [Telegram Bot API - Webhooks](https://core.telegram.org/bots/api#setwebhook)
- [Ngrok Documentation](https://ngrok.com/docs)
- [Express.js Documentation](https://expressjs.com/)

---

## ✅ Success Indicators

Bot Anda **berhasil setup** jika:

- ✅ `node check-webhook.js` menunjukkan URL terset
- ✅ No error messages di webhook info
- ✅ Pending updates = 0 (atau berkurang saat bot ditest)
- ✅ Console menunjukkan log saat command dikirim
- ✅ Bot merespon command di Telegram

---

**Happy coding! 🚀**

Jika masih ada masalah, check error log di console atau webhook info untuk detail lebih lanjut.
