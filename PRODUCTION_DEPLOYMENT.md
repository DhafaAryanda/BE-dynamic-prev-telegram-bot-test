# 🚀 Production Deployment Guide

## Perbedaan Development vs Production

### **Development (dengan ngrok)**

- ✅ URL berubah setiap restart ngrok
- ✅ Manual setup webhook setiap kali
- ✅ Script `setup-webhook.js` untuk ngrok

### **Production (domain tetap)**

- ✅ URL tetap dan stabil
- ✅ Setup webhook sekali saja
- ✅ Auto-setup webhook saat bot start (opsional)

---

## 🎯 **3 Cara Setup Webhook di Production**

### **Cara 1: Otomatis via Endpoint (Paling Mudah)**

Bot Anda sudah punya endpoint `/set-webhook` yang bisa dipanggil setelah deploy:

```bash
# Setelah deploy, panggil endpoint ini
curl -X POST https://yourdomain.com/set-webhook
```

**Atau buka di browser:**

```
https://yourdomain.com/set-webhook
```

### **Cara 2: Manual via Script**

```bash
# Gunakan script khusus production
node deploy-setup.js https://yourdomain.com
```

### **Cara 3: Auto-setup saat Bot Start**

Saya sudah modifikasi `bot.service.ts` untuk auto-setup webhook di production:

```typescript
// Bot akan otomatis set webhook saat NODE_ENV=production
if (config.server.nodeEnv === "production" && config.telegram.webhookUrl) {
  await this.autoSetWebhook();
}
```

---

## 📋 **Environment Variables untuk Production**

Set di hosting platform Anda (Heroku, Railway, Vercel, dll):

```env
# Required
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
NODE_ENV=production

# Webhook (satu dari dua pilihan)
TELEGRAM_WEBHOOK_URL=https://yourdomain.com
# ATAU bot akan auto-setup dari domain yang Anda berikan

# Optional
TELEGRAM_WEBHOOK_SECRET=your_production_secret_key
PORT=3000

# Database (jika menggunakan)
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_NAME=your_db_name
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false
```

---

## 🚀 **Deployment Steps**

### **Step 1: Deploy ke Hosting Platform**

**Heroku:**

```bash
# Install Heroku CLI
npm install -g heroku

# Login dan create app
heroku login
heroku create your-bot-name

# Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set NODE_ENV=production
heroku config:set TELEGRAM_WEBHOOK_URL=https://your-bot-name.herokuapp.com

# Deploy
git push heroku main
```

**Railway:**

```bash
# Connect GitHub repo
# Set environment variables di dashboard
# Auto-deploy dari GitHub
```

**Vercel:**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables di dashboard
```

### **Step 2: Setup Webhook**

**Pilihan A - Otomatis (jika NODE_ENV=production):**

```bash
# Bot akan auto-setup webhook saat start
# Cek log untuk konfirmasi
```

**Pilihan B - Manual via Endpoint:**

```bash
# Panggil endpoint setelah deploy
curl -X POST https://yourdomain.com/set-webhook
```

**Pilihan C - Manual via Script:**

```bash
# Download script ke local machine
node deploy-setup.js https://yourdomain.com
```

### **Step 3: Verify Setup**

```bash
# Check webhook status
node check-webhook.js

# Test bot
# Kirim /start di Telegram
```

---

## 🔧 **Platform-Specific Setup**

### **Heroku**

```bash
# 1. Create app
heroku create your-bot-name

# 2. Set environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set NODE_ENV=production
heroku config:set TELEGRAM_WEBHOOK_URL=https://your-bot-name.herokuapp.com
heroku config:set TELEGRAM_WEBHOOK_SECRET=your_secret

# 3. Deploy
git push heroku main

# 4. Setup webhook
curl -X POST https://your-bot-name.herokuapp.com/set-webhook
```

### **Railway**

```bash
# 1. Connect GitHub repo di Railway dashboard
# 2. Set environment variables di dashboard:
#    - TELEGRAM_BOT_TOKEN
#    - NODE_ENV=production
#    - TELEGRAM_WEBHOOK_URL=https://your-app.railway.app
# 3. Deploy otomatis
# 4. Setup webhook
curl -X POST https://your-app.railway.app/set-webhook
```

### **Vercel**

```bash
# 1. Deploy
vercel --prod

# 2. Set environment variables di Vercel dashboard
# 3. Setup webhook
curl -X POST https://your-app.vercel.app/set-webhook
```

### **DigitalOcean App Platform**

```bash
# 1. Connect GitHub repo
# 2. Set environment variables di dashboard
# 3. Deploy
# 4. Setup webhook
curl -X POST https://your-app.ondigitalocean.app/set-webhook
```

---

## 🔍 **Troubleshooting Production**

### **Webhook Not Working**

1. **Check domain accessibility:**

```bash
curl https://yourdomain.com/health
```

2. **Check webhook endpoint:**

```bash
curl -X POST https://yourdomain.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

3. **Check webhook status:**

```bash
node check-webhook.js
```

### **Common Production Issues**

**Error: "Connection refused"**

- ✅ Check if server is running
- ✅ Check if port is correct
- ✅ Check if domain is accessible

**Error: "SSL certificate"**

- ✅ Make sure domain uses HTTPS
- ✅ Check SSL certificate validity

**Error: "404 Not Found"**

- ✅ Check if /webhook endpoint exists
- ✅ Check if server is responding correctly

**Error: "Secret token mismatch"**

- ✅ Check TELEGRAM_WEBHOOK_SECRET
- ✅ Make sure it matches in bot and Telegram

---

## 📊 **Monitoring Production**

### **Health Check Endpoint**

Bot Anda punya endpoint `/health` untuk monitoring:

```bash
curl https://yourdomain.com/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2025-01-22T10:30:00.000Z",
  "uptime": 3600
}
```

### **Log Monitoring**

Monitor logs untuk:

- ✅ Webhook requests masuk
- ✅ Command responses
- ✅ Error messages
- ✅ User activity

### **Uptime Monitoring**

Set up monitoring service seperti:

- **UptimeRobot** - Free uptime monitoring
- **Pingdom** - Advanced monitoring
- **StatusCake** - Comprehensive monitoring

---

## 🔄 **Update Bot di Production**

### **Code Update**

```bash
# Heroku
git push heroku main

# Railway
git push origin main  # Auto-deploy

# Vercel
vercel --prod
```

### **Environment Variables Update**

```bash
# Heroku
heroku config:set NEW_VARIABLE=value

# Railway/Vercel
# Update di dashboard
```

### **Webhook Update (jika domain berubah)**

```bash
# Set webhook baru
node deploy-setup.js https://new-domain.com
```

---

## 💡 **Best Practices Production**

### **Security**

1. **Use strong webhook secret:**

```env
TELEGRAM_WEBHOOK_SECRET=very_long_random_string_123456789
```

2. **Enable HTTPS only:**

```javascript
// Bot sudah handle ini otomatis
```

3. **Rate limiting:**

```javascript
// Consider adding rate limiting for production
```

### **Performance**

1. **Database connection pooling:**

```javascript
// TypeORM sudah handle connection pooling
```

2. **Error handling:**

```javascript
// Bot sudah punya comprehensive error handling
```

3. **Logging:**

```javascript
// Structured logging sudah implemented
```

### **Monitoring**

1. **Health checks:**

```bash
# Regular health check
curl https://yourdomain.com/health
```

2. **Log monitoring:**

```bash
# Monitor server logs
heroku logs --tail  # Heroku
railway logs        # Railway
```

3. **Webhook monitoring:**

```bash
# Check webhook status regularly
node check-webhook.js
```

---

## 🎯 **Quick Production Checklist**

- [ ] Deploy bot ke hosting platform
- [ ] Set environment variables
- [ ] Test domain accessibility
- [ ] Setup webhook (otomatis atau manual)
- [ ] Verify webhook status
- [ ] Test bot di Telegram
- [ ] Setup monitoring
- [ ] Document deployment process

---

## 📞 **Support**

Jika ada masalah dengan production deployment:

1. **Check logs** di hosting platform
2. **Verify webhook** dengan `node check-webhook.js`
3. **Test endpoints** dengan curl
4. **Check environment variables**
5. **Review this guide** untuk troubleshooting

---

**Happy deploying! 🚀**

Bot Anda sekarang siap untuk production dengan webhook yang stabil dan tidak perlu setup manual setiap kali!
