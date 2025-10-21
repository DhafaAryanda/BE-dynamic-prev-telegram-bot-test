# Telegram Bot Safir

A modern Telegram bot built with TypeScript, TypeORM, PostgreSQL, and Express.js.

## Features

- 🤖 **Telegram Bot Integration** - Built with `node-telegram-bot-api`
- 🗄️ **Database Support** - PostgreSQL with TypeORM
- 🌐 **Webhook Support** - Express.js server for webhook handling
- 📡 **Event System** - EventEmitter for decoupled event handling
- ✅ **Validation** - Input validation with `class-validator`
- 🔒 **Security** - Helmet, CORS, and webhook secret validation
- 📊 **User Management** - Automatic user registration and tracking
- 🏗️ **Repository Pattern** - Clean separation of data access logic
- 📝 **Logging** - Structured logging with different log levels
- ⚠️ **Error Handling** - Centralized error handling with custom error classes
- 🎯 **Type Safety** - Full TypeScript support with strict mode

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Bot Library**: node-telegram-bot-api
- **Web Framework**: Express.js
- **Validation**: class-validator & class-transformer
- **Security**: Helmet, CORS
- **Environment**: dotenv

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=telegram_bot_db

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_WEBHOOK_URL=https://yourdomain.com/webhook
TELEGRAM_WEBHOOK_SECRET=your_webhook_secret

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. Database Setup

Make sure PostgreSQL is running and create the database:

```sql
CREATE DATABASE telegram_bot_db;
```

### 4. Run the Application

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   └── webhook.server.ts      # Express webhook server
├── command/
│   └── command-handlers.ts    # Bot command handlers
├── config/
│   └── config.ts              # Application configuration
├── database/
│   ├── data-source.ts         # TypeORM data source
│   ├── entities/
│   │   └── user.entity.ts     # User entity
│   └── repositories/
│       └── user.repository.ts # User repository (Repository Pattern)
├── events/
│   ├── event-emitter.ts       # Custom event emitter
│   └── event-handlers.ts      # Event handlers
├── services/
│   └── bot.service.ts         # Bot service layer
├── types/
│   └── telegram.types.ts      # TypeScript types
├── utils/
│   ├── logger.ts              # Logging utility
│   └── error-handler.ts       # Error handling utilities
├── validators/
│   └── telegram.validators.ts # Input validators
└── index.ts                   # Application entry point
```

## API Endpoints

- `GET /health` - Health check
- `POST /webhook` - Telegram webhook endpoint
- `POST /set-webhook` - Set webhook URL
- `DELETE /webhook` - Delete webhook
- `GET /webhook-info` - Get webhook information

## Bot Commands

- `/start` - Start the bot
- `/help` - Show help information
- `/profile` - View user profile
- `/settings` - Bot settings

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Database Migrations

The application uses TypeORM with automatic synchronization in development mode. For production, consider using migrations.

### Architecture

This boilerplate follows industry-standard practices:

- **Repository Pattern**: Separates data access logic from business logic
- **Service Layer**: Encapsulates business logic
- **Event-Driven Architecture**: Decoupled components using EventEmitter
- **Centralized Error Handling**: Custom error classes and error handler
- **Structured Logging**: Logger with different log levels
- **Type Safety**: Full TypeScript with strict mode
- **Clean Code**: Follows SOLID principles

## Deployment

1. Set up your PostgreSQL database
2. Configure environment variables
3. Set up your webhook URL
4. Deploy to your preferred platform (Heroku, Railway, etc.)
5. Set the webhook URL using the `/set-webhook` endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details.
