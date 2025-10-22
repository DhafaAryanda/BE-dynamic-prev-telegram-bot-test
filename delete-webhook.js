/**
 * Delete Webhook Script
 *
 * Script ini untuk menghapus webhook dari Telegram
 * Berguna jika ingin switch ke polling mode atau reset webhook
 *
 * Usage: node delete-webhook.js
 */

const https = require("https");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error("❌ Error: TELEGRAM_BOT_TOKEN not found in .env file!");
  process.exit(1);
}

console.log("🗑️  Deleting webhook...\n");

const options = {
  hostname: "api.telegram.org",
  port: 443,
  path: `/bot${botToken}/deleteWebhook?drop_pending_updates=true`,
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
        console.log("✅ Webhook deleted successfully!");
        console.log("📋 Response:", JSON.stringify(result, null, 2));
        console.log("\n💡 What's next?");
        console.log(
          '  • To use webhook mode: Run "node setup-webhook.js <ngrok-url>"'
        );
        console.log(
          "  • To use polling mode: Update your bot.service.ts to enable polling"
        );
        console.log('  • To check status: Run "node check-webhook.js"');
      } else {
        console.error("❌ Failed to delete webhook!");
        console.error("Error:", result.description);
      }
    });
  })
  .on("error", (error) => {
    console.error("❌ Request failed:", error.message);
    process.exit(1);
  });
