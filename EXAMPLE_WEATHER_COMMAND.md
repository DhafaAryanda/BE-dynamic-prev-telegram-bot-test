# Contoh Lengkap: Command /weather

## 📋 Step by Step Implementation

### **Step 1: Register Command di CommandHandlers**

```typescript
// Di src/command/command-handlers.ts
// Tambahkan di method initialize() setelah /stats

this.botService.registerCommand({
  command: "/weather",
  description: "Get weather information",
  handler: this.handleWeather.bind(this),
});
```

### **Step 2: Buat Handler Method**

```typescript
// Di src/command/command-handlers.ts
// Tambahkan method baru di class CommandHandlers

private async handleWeather(message: Message): Promise<void> {
  if (!message.from) return;

  const user = await this.getUser(message.from.id);
  botEventEmitter.emit("command:weather", message, user);

  try {
    // Parse command arguments (optional)
    const args = message.text?.split(" ").slice(1); // Remove /weather
    const city = args?.[0] || "Jakarta"; // Default city

    // Your command logic here
    const weatherData = await this.getWeatherData(city);

    const weatherText = `
🌤️ <b>Weather Information</b>

<b>City:</b> ${city}
<b>Temperature:</b> ${weatherData.temperature}°C
<b>Condition:</b> ${weatherData.condition}
<b>Humidity:</b> ${weatherData.humidity}%
<b>Wind:</b> ${weatherData.wind} km/h

<b>Last Updated:</b> ${new Date().toLocaleString()}
    `.trim();

    await this.botService.sendMessage(message.chat.id, weatherText, {
      parse_mode: "HTML",
    });
  } catch (error) {
    logger.error("Error fetching weather", { error });
    await this.botService.sendMessage(
      message.chat.id,
      "❌ Failed to fetch weather data. Please try again later.",
      { parse_mode: "HTML" }
    );
  }
}

// Helper method untuk get weather data
private async getWeatherData(city: string): Promise<any> {
  // Simulate API call - replace with real weather API
  return {
    temperature: Math.floor(Math.random() * 30) + 10,
    condition: "Sunny",
    humidity: Math.floor(Math.random() * 50) + 30,
    wind: Math.floor(Math.random() * 20) + 5,
  };
}
```

### **Step 3: Update Bot Commands List**

```typescript
// Di src/services/bot.service.ts
// Di method setBotCommands(), tambahkan

const commands = [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Show help information" },
  { command: "profile", description: "Show your profile" },
  { command: "settings", description: "Bot settings" },
  { command: "stats", description: "Show bot statistics" },
  { command: "weather", description: "Get weather information" }, // ← Tambahkan ini
];
```

### **Step 4: Add Event Type**

```typescript
// Di src/events/event-emitter.ts
// Tambahkan di interface BotEvents

export interface BotEvents {
  "user:register": (user: User) => void;
  "user:update": (user: User) => void;
  "message:received": (message: Message, user: User) => void;
  "callback:received": (callbackQuery: CallbackQuery, user: User) => void;
  "command:start": (message: Message, user: User) => void;
  "command:help": (message: Message, user: User) => void;
  "command:stats": (message: Message, user: User) => void;
  "command:weather": (message: Message, user: User) => void; // ← Tambahkan ini
  "error:bot": (error: Error, context?: any) => void;
  "error:database": (error: Error, context?: any) => void;
}
```

### **Step 5: Add Event Handler**

```typescript
// Di src/events/event-handlers.ts
// Tambahkan di method initialize() setelah command:stats

botEventEmitter.on("command:weather", async (message: Message, user: User) => {
  logger.info(`🌤️ Weather command from ${user.getDisplayName()}`);
});
```

### **Step 6: Update Help Messages**

```typescript
// Di src/command/command-handlers.ts
// Update handleStart() dan handleHelp()

// Di handleStart(), tambahkan /weather
const welcomeText = `
🎉 Welcome to Safir Bot!

Hello ${user.getDisplayName()}! I'm your personal assistant bot.

Available commands:
/help - Show help information
/profile - View your profile
/settings - Bot settings
/stats - Show bot statistics
/weather - Get weather information

How can I help you today?
`.trim();

// Di handleHelp(), tambahkan /weather
const helpText = `
📚 <b>Help & Commands</b>

<b>Basic Commands:</b>
/start - Start the bot
/help - Show this help message
/profile - View your profile
/settings - Bot settings
/stats - Show bot statistics
/weather - Get weather information

<b>Features:</b>
• User management
• Event tracking
• Database integration
• Webhook support

<b>Need more help?</b>
Contact the administrator for assistance.
`.trim();
```

---

## 🎯 **Contoh Command dengan Database**

### **Command /favorite - Simpan Favorite City**

```typescript
// Handler method
private async handleFavorite(message: Message): Promise<void> {
  if (!message.from) return;

  const user = await this.getUser(message.from.id);
  botEventEmitter.emit("command:favorite", message, user);

  try {
    const args = message.text?.split(" ").slice(1);
    const city = args?.[0];

    if (!city) {
      // Show current favorite
      const favoriteCity = user.favoriteCity || "Not set";
      await this.botService.sendMessage(
        message.chat.id,
        `❤️ Your favorite city: ${favoriteCity}`,
        { parse_mode: "HTML" }
      );
      return;
    }

    // Save favorite city
    user.favoriteCity = city;
    await this.userRepository.save(user);

    await this.botService.sendMessage(
      message.chat.id,
      `✅ Favorite city set to: ${city}`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    logger.error("Error setting favorite", { error });
    await this.botService.sendMessage(
      message.chat.id,
      "❌ Failed to set favorite city. Please try again later.",
      { parse_mode: "HTML" }
    );
  }
}
```

### **Command /reminder - Set Reminder**

```typescript
// Handler method
private async handleReminder(message: Message): Promise<void> {
  if (!message.from) return;

  const user = await this.getUser(message.from.id);
  botEventEmitter.emit("command:reminder", message, user);

  try {
    const args = message.text?.split(" ").slice(1);
    const time = args?.[0];
    const message_text = args?.slice(1).join(" ");

    if (!time || !message_text) {
      await this.botService.sendMessage(
        message.chat.id,
        "Usage: /reminder <time> <message>\nExample: /reminder 10m Check weather",
        { parse_mode: "HTML" }
      );
      return;
    }

    // Parse time (simple implementation)
    const minutes = parseInt(time.replace("m", ""));
    const reminderTime = new Date(Date.now() + minutes * 60000);

    // Save reminder to database (you need to create Reminder entity)
    // const reminder = await this.reminderRepository.create({
    //   userId: user.id,
    //   message: message_text,
    //   reminderTime: reminderTime,
    //   chatId: message.chat.id
    // });

    await this.botService.sendMessage(
      message.chat.id,
      `⏰ Reminder set for ${time}: ${message_text}`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    logger.error("Error setting reminder", { error });
    await this.botService.sendMessage(
      message.chat.id,
      "❌ Failed to set reminder. Please try again later.",
      { parse_mode: "HTML" }
    );
  }
}
```

---

## 🔧 **Command dengan Inline Keyboard**

### **Command /menu - Show Menu**

```typescript
// Handler method
private async handleMenu(message: Message): Promise<void> {
  if (!message.from) return;

  const user = await this.getUser(message.from.id);
  botEventEmitter.emit("command:menu", message, user);

  const menuText = `
🍽️ <b>Main Menu</b>

Choose an option below:
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "🌤️ Weather", callback_data: "menu_weather" },
        { text: "📊 Stats", callback_data: "menu_stats" },
      ],
      [
        { text: "👤 Profile", callback_data: "menu_profile" },
        { text: "⚙️ Settings", callback_data: "menu_settings" },
      ],
    ],
  };

  await this.botService.sendMessage(message.chat.id, menuText, {
    parse_mode: "HTML",
    reply_markup: keyboard,
  });
}
```

---

## 📝 **Checklist untuk Command Baru**

- [ ] Register command di `initialize()`
- [ ] Buat handler method
- [ ] Update bot commands list
- [ ] Add event type
- [ ] Add event handler
- [ ] Update help messages
- [ ] Test command
- [ ] Add error handling
- [ ] Add logging
- [ ] Update documentation

---

## 🎯 **Best Practices**

### **DO:**

- ✅ Selalu validate `message.from`
- ✅ Gunakan try-catch untuk error handling
- ✅ Emit event untuk tracking
- ✅ Format response dengan baik
- ✅ Log setiap action penting
- ✅ Berikan feedback yang jelas ke user

### **DON'T:**

- ❌ Jangan akses database langsung dari handler
- ❌ Jangan lupa bind context saat register handler
- ❌ Jangan expose sensitive information
- ❌ Jangan lupa update bot commands list

---

## 🚀 **Testing Command**

```bash
# 1. Restart bot
npm run dev

# 2. Test command di Telegram
/weather
/weather Jakarta
/weather Bandung

# 3. Check logs
# Lihat console untuk log command
```

---

**Happy coding! 🚀**

Gunakan pattern ini untuk membuat command apapun yang Anda inginkan!
