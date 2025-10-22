/**
 * Webhook Checker Script
 *
 * Script ini untuk mengecek status webhook dan troubleshooting
 *
 * Usage: node check-webhook.js
 */

const https = require("https");
require("dotenv").config();

const botToken = process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
  console.error("❌ Error: TELEGRAM_BOT_TOKEN not found in .env file!");
  process.exit(1);
}

console.log("🔍 Checking webhook status...\n");

// Get webhook info
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
        const info = result.result;

        console.log("📊 Webhook Information:\n");
        console.log(`   URL: ${info.url || "❌ NOT SET"}`);
        console.log(
          `   Has Custom Certificate: ${info.has_custom_certificate}`
        );
        console.log(`   Pending Update Count: ${info.pending_update_count}`);
        console.log(
          `   Max Connections: ${info.max_connections || "default (40)"}`
        );

        if (info.allowed_updates && info.allowed_updates.length > 0) {
          console.log(`   Allowed Updates: ${info.allowed_updates.join(", ")}`);
        }

        console.log("");

        // Check for errors
        if (info.last_error_date) {
          const errorDate = new Date(info.last_error_date * 1000);
          console.log("⚠️  WEBHOOK ERRORS DETECTED:");
          console.log(`   Last Error Date: ${errorDate.toLocaleString()}`);
          console.log(`   Last Error Message: ${info.last_error_message}`);
          console.log("");

          // Provide suggestions
          console.log("💡 Troubleshooting Tips:");
          if (info.last_error_message.includes("Connection")) {
            console.log("   • Check if ngrok is still running");
            console.log("   • Verify webhook URL is accessible");
            console.log("   • Check if your server is running on correct port");
          }
          if (info.last_error_message.includes("SSL")) {
            console.log(
              "   • Make sure you're using HTTPS (ngrok provides this)"
            );
            console.log("   • Check SSL certificate validity");
          }
          if (info.last_error_message.includes("404")) {
            console.log("   • Check if /webhook endpoint exists");
            console.log(
              "   • Verify your webhook.server.ts is configured correctly"
            );
          }
          if (info.last_error_message.includes("Secret token")) {
            console.log("   • Check TELEGRAM_WEBHOOK_SECRET in your .env");
            console.log("   • Make sure it matches in bot and Telegram");
          }
          console.log("");
        } else {
          console.log("✅ No webhook errors detected!");
          console.log("");
        }

        // Check if webhook is set
        if (!info.url) {
          console.log("❌ WEBHOOK IS NOT SET!");
          console.log("");
          console.log("To set webhook, run:");
          console.log("  node setup-webhook.js <your-ngrok-url>");
          console.log("");
          console.log("Example:");
          console.log("  node setup-webhook.js https://xxxx.ngrok-free.app");
        } else {
          console.log("✅ Webhook is configured!");

          if (info.pending_update_count > 0) {
            console.log(
              `\n⚠️  You have ${info.pending_update_count} pending updates.`
            );
            console.log("This might mean:");
            console.log("  • Your bot was offline when users sent messages");
            console.log("  • Webhook URL changed");
            console.log("  • Server is not responding properly");
          }
        }

        console.log("");
        console.log("📝 Quick Commands:");
        console.log("  • Delete webhook: node delete-webhook.js");
        console.log("  • Set new webhook: node setup-webhook.js <ngrok-url>");
        console.log("  • Check again: node check-webhook.js");
      } else {
        console.error("❌ Failed to get webhook info!");
        console.error("Error:", result.description);
      }
    });
  })
  .on("error", (error) => {
    console.error("❌ Request failed:", error.message);
    process.exit(1);
  });
