/**
 * Production Deployment Webhook Setup
 *
 * Script ini untuk set up webhook setelah deploy ke production
 *
 * Usage:
 * 1. Deploy bot ke server (Heroku, Railway, Vercel, dll)
 * 2. Set environment variables di hosting platform
 * 3. node deploy-setup.js <your-domain>
 *
 * Example:
 * node deploy-setup.js https://mybot.herokuapp.com
 */

const https = require("https");
require("dotenv").config();

const args = process.argv.slice(2);
const domain = args[0];

if (!domain) {
  console.error("❌ Error: Domain is required!");
  console.log("\nUsage:");
  console.log("  node deploy-setup.js <your-domain>");
  console.log("\nExample:");
  console.log("  node deploy-setup.js https://mybot.herokuapp.com");
  console.log("  node deploy-setup.js https://mybot.railway.app");
  console.log("  node deploy-setup.js https://mybot.vercel.app");
  process.exit(1);
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret =
  process.env.TELEGRAM_WEBHOOK_SECRET || "production_secret_123";

if (!botToken) {
  console.error(
    "❌ Error: TELEGRAM_BOT_TOKEN not found in environment variables!"
  );
  console.log(
    "\nMake sure to set these environment variables in your hosting platform:"
  );
  console.log("  • TELEGRAM_BOT_TOKEN");
  console.log("  • TELEGRAM_WEBHOOK_SECRET (optional)");
  console.log("  • TELEGRAM_WEBHOOK_URL (optional, will use domain parameter)");
  process.exit(1);
}

// Ensure domain has https and no trailing slash
const cleanDomain = domain.replace(/\/$/, "");
const webhookUrl = `${cleanDomain}/webhook`;

console.log("🚀 Setting up webhook for production deployment...\n");
console.log("📋 Configuration:");
console.log(`   Bot Token: ${botToken.substring(0, 10)}...`);
console.log(`   Webhook URL: ${webhookUrl}`);
console.log(`   Secret Token: ${webhookSecret}\n`);

// Set webhook
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

      // Common production issues
      console.log("\n💡 Common Production Issues:");
      console.log("  • Make sure your domain is accessible via HTTPS");
      console.log("  • Check if your server is running and responding");
      console.log("  • Verify /webhook endpoint exists");
      console.log("  • Test: curl -X POST " + webhookUrl);

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

          console.log("\n✅ Production setup complete!");
          console.log("🎉 Your bot is now live and ready to receive messages!");
          console.log("\n📝 Next steps:");
          console.log("  • Test your bot by sending /start in Telegram");
          console.log("  • Monitor your server logs for incoming messages");
          console.log("  • Set up monitoring/alerting for production");
        }
      });
    })
    .on("error", (error) => {
      console.error("❌ Failed to get webhook info:", error.message);
    });
}
