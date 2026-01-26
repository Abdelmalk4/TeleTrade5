# TeleTrade

**White-label Telegram subscription automation platform with crypto payments**

## Overview

TeleTrade enables Telegram trading signal channel owners to automate subscriber
management, payment processing, and access control through cryptocurrency
payments.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐
│    Main Bot     │     │  Selling Bots   │
│  (Admin Control)│     │ (Subscriber UX) │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────┴──────┐
              │   Supabase  │
              │  PostgreSQL │
              └──────┬──────┘
                     │
              ┌──────┴──────┐
              │ NOWPayments │
              │   Webhooks  │
              └─────────────┘
```

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Bot Framework**: grammY
- **Database**: Supabase (PostgreSQL + Prisma)
- **Payments**: NOWPayments (crypto)
- **Hosting**: Railway.com

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Database

```bash
npm run db:generate
npm run db:push
```

### 4. Run Development

```bash
# Start Main Bot
npm run dev:main-bot

# Start Selling Bots (separate terminal)
npm run dev:selling-bot
```

## Project Structure

```
src/
├── main-bot/           # Control plane (admin/client management)
│   ├── handlers/       # Command handlers
│   ├── middleware/     # Auth, client loading
│   └── index.ts        # Entry point
│
├── selling-bot/        # Subscriber interface
│   ├── handlers/       # Subscription/payment handlers
│   ├── middleware/     # Bot config, subscriber loading
│   └── index.ts        # Entry point + bot factory
│
├── database/           # Prisma client
├── shared/             # Shared utilities
│   ├── config/         # Environment config
│   ├── types/          # TypeScript types
│   ├── utils/          # Helpers (logger, date, format)
│   └── integrations/   # NOWPayments, Telegram utils
│
└── prisma/             # Database schema
```

## Key Features

- **Non-custodial payments**: Client's funds go directly to their wallet
- **Multi-bot support**: Clients can run multiple selling bots
- **7-day free trial**: Automatic trial activation on first bot creation
- **Automated access control**: Grant/revoke channel access based on
  subscription
- **White-label branding**: Customizable messages with mandatory platform footer

## Environment Variables

| Variable                       | Description                           |
| ------------------------------ | ------------------------------------- |
| `SUPABASE_URL`                 | Supabase project URL                  |
| `DATABASE_URL`                 | PostgreSQL connection string          |
| `MAIN_BOT_TOKEN`               | Main Bot token from @BotFather        |
| `PLATFORM_ADMIN_IDS`           | Comma-separated admin Telegram IDs    |
| `NOWPAYMENTS_IPN_CALLBACK_URL` | Webhook URL for payment notifications |

See `.env.example` for full configuration.

## Deployment (Railway)

1. Create new Railway project
2. Connect GitHub repo
3. Add environment variables
4. Deploy Main Bot and Selling Bot as separate services

## License

Proprietary - All rights reserved
