# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in:
   - **Name**: TeleTrade (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

---

## Step 2: Get Connection Credentials

### A. Get API Keys

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values to your `.env` file:
   ```bash
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...  (long key)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  (different long key)
   ```

### B. Get Database Connection String

1. Go to **Settings** → **Database**
2. Scroll to **Connection String** section
3. Select **"Transaction"** mode (uses port 6543)
4. Click **"URI"** tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your database password
7. Paste into `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

---

## Step 3: Push Database Schema

Run this command to create all tables:

```bash
npm run db:push
```

This will create:

- ✅ `clients` table
- ✅ `selling_bots` table
- ✅ `subscribers` table
- ✅ `subscription_plans` table
- ✅ `payment_transactions` table
- ✅ `access_control_logs` table
- ✅ `platform_admins` table
- ✅ `notification_logs` table

---

## Step 4: Verify in Supabase

1. Go to **Table Editor** in Supabase Dashboard
2. You should see all 8 tables listed
3. Click on any table to view its structure

---

## Step 5: Create Your First Platform Admin

After tables are created, add yourself as admin:

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your Telegram user ID):

```sql
INSERT INTO platform_admins (id, telegram_user_id, username, role)
VALUES (
  gen_random_uuid(),
  123456789,  -- Replace with YOUR Telegram user ID
  'your_username',  -- Your Telegram username (optional)
  'SUPER_ADMIN'
);
```

**How to get your Telegram user ID:**

- Message [@userinfobot](https://t.me/userinfobot) on Telegram
- It will reply with your user ID

---

## Step 6: Update .env with Bot Tokens

1. Create your Main Bot:
   - Message [@BotFather](https://t.me/BotFather)
   - Send `/newbot`
   - Follow instructions
   - Copy the token to `.env`:
     ```bash
     MAIN_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
     ```

2. Add your admin ID:
   ```bash
   PLATFORM_ADMIN_IDS=123456789  # Your Telegram user ID
   ```

---

## Step 7: Test the Setup

Start the Main Bot:

```bash
npm run dev:main-bot
```

Then:

1. Open Telegram
2. Search for your bot (@your_bot_username)
3. Send `/start`
4. You should see the admin dashboard!

---

## Troubleshooting

### "Invalid `prisma.client.create()` invocation"

- Check `DATABASE_URL` is correct in `.env`
- Make sure you replaced `[YOUR-PASSWORD]` with actual password
- Verify the connection string uses port **6543** (Transaction mode)

### "Environment variable not found"

- Make sure `.env` file exists (not `.env.example`)
- Check all required variables are set

### Tables not created

- Run `npm run db:push` again
- Check Supabase project is active (not paused)

---

## Next Steps

Once database is set up:

1. ✅ Main Bot will work for admin/client management
2. ✅ Clients can register and create Selling Bots
3. ✅ Configure NOWPayments for crypto payments
4. ✅ Deploy to Railway for production
