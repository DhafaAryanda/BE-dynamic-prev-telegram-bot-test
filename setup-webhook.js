/**
 * Webhook Setup Helper Script
 *
 * Script ini membantu Anda set up webhook dengan mudah
 *
 * Usage:
 * 1. Jalankan ngrok: ngrok http 3000
 * 2. Copy ngrok URL
 * 3. node setup-webhook.js <ngrok-url>
 *
 * Example:
 * node setup-webhook.js https://xxxx.ngrok-free.app
 */

const https = require("https");
const http = require("http");
require("dotenv").config();

const args = process.argv.slice(2);
const ngrokUrl = args[0];

if (!ngrokUrl) {
  console.error("❌ Error: Ngrok URL is required!");
  console.log("\nUsage:");
  console.log("  node setup-webhook.js <ngrok-url>");
  console.log("\nExample:");
  console.log("  node setup-webhook.js https://xxxx.ngrok-free.app");
  process.exit(1);
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret =
  process.env.TELEGRAM_WEBHOOK_SECRET || "my_secret_key_123";

if (!botToken) {
  console.error("❌ Error: TELEGRAM_BOT_TOKEN not found in .env file!");
  process.exit(1);
}

console.log("🚀 Setting up webhook...\n");
console.log("📋 Configuration:");
console.log(`   Bot Token: ${botToken.substring(0, 10)}...`);
console.log(`   Webhook URL: ${ngrokUrl}/webhook`);
console.log(`   Secret Token: ${webhookSecret}\n`);

// Set webhook
const webhookUrl = `${ngrokUrl}/webhook`;
const data = JSON.stringify({
  url: webhookUrl,
  secret_token: webhookSecret,
  allowed_updates: ["message", "callback_query"],
  drop_pending_updates: true,
});

const options = {
  hostname: "api.telegram.org",
  port: 443,
  path: `/bot${botToken}/setWebhook`,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length,
  },
};

console.log("⏳ Setting webhook to Telegram...");

const req = https.request(options, (res) => {
  let responseData = "";

  res.on("data", (chunk) => {
    responseData += chunk;
  });

  res.on("end", () => {
    const result = JSON.parse(responseData);

    if (result.ok) {
      console.log("✅ Webhook set successfully!\n");
      console.log("📊 Response:", JSON.stringify(result, null, 2));

      // Get webhook info
      setTimeout(() => {
        console.log("\n🔍 Verifying webhook info...");
        getWebhookInfo();
      }, 1000);
    } else {
      console.error("❌ Failed to set webhook!");
      console.error("Error:", result.description);
      process.exit(1);
    }
  });
});

req.on("error", (error) => {
  console.error("❌ Request failed:", error.message);
  process.exit(1);
});

req.write(data);
req.end();

// Function to get webhook info
function getWebhookInfo() {
  const options = {
    hostname: "api.telegram.org",
    port: 443,
    path: `/bot${botToken}/getWebhookInfo`,
    method: "GET",
  };

  https
    .get(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const result = JSON.parse(data);

        if (result.ok) {
          console.log("\n📋 Current Webhook Info:");
          console.log(JSON.stringify(result.result, null, 2));

          if (result.result.last_error_message) {
            console.log("\n⚠️  Warning: Last error message detected:");
            console.log(result.result.last_error_message);
          }

          console.log("\n✅ Setup complete! You can now test your bot.");
          console.log("💡 Tip: Open Telegram and send /start to your bot");
        }
      });
    })
    .on("error", (error) => {
      console.error("❌ Failed to get webhook info:", error.message);
    });
}
