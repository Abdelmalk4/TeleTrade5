-- =============================================
-- TeleTrade Database Schema for Supabase
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE client_status AS ENUM ('PENDING', 'ACTIVE', 'TRIAL', 'EXPIRED', 'SUSPENDED');
CREATE TYPE bot_status AS ENUM ('ACTIVE', 'PAUSED', 'DELETED');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'PENDING_PAYMENT', 'REVOKED');
CREATE TYPE plan_type AS ENUM ('PLATFORM', 'CLIENT');
CREATE TYPE payment_status AS ENUM ('PENDING', 'CONFIRMING', 'CONFIRMED', 'FAILED', 'EXPIRED', 'REFUNDED');
CREATE TYPE payment_type AS ENUM ('SUBSCRIBER_SUBSCRIPTION', 'PLATFORM_SUBSCRIPTION');
CREATE TYPE access_action AS ENUM ('GRANT', 'REVOKE', 'MANUAL_EXTEND', 'MANUAL_REVOKE');
CREATE TYPE performed_by AS ENUM ('SYSTEM', 'CLIENT', 'ADMIN');
CREATE TYPE admin_role AS ENUM ('SUPER_ADMIN', 'SUPPORT');

-- =============================================
-- TABLES
-- =============================================

-- Platform Admins
CREATE TABLE platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_user_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    role admin_role DEFAULT 'SUPPORT',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (Channel Owners)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_user_id BIGINT UNIQUE NOT NULL,
    username TEXT,
    business_name TEXT NOT NULL,
    contact_email TEXT,
    channel_username TEXT,
    status client_status DEFAULT 'PENDING',
    trial_start_date TIMESTAMPTZ,
    trial_end_date TIMESTAMPTZ,
    trial_activated BOOLEAN DEFAULT FALSE,
    platform_subscription_plan_id UUID,
    platform_subscription_start TIMESTAMPTZ,
    platform_subscription_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Selling Bots
CREATE TABLE selling_bots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    bot_token TEXT UNIQUE NOT NULL,
    bot_username TEXT,
    bot_name TEXT,
    nowpayments_api_key TEXT NOT NULL,
    crypto_wallet_address TEXT NOT NULL,
    linked_channel_id BIGINT,
    linked_channel_username TEXT,
    welcome_message TEXT,
    status bot_status DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_type plan_type NOT NULL,
    bot_id UUID REFERENCES selling_bots(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL,
    price_amount DECIMAL(18, 8) NOT NULL,
    price_currency TEXT DEFAULT 'USDT',
    max_bots INTEGER,
    max_subscribers INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key for client's platform plan
ALTER TABLE clients 
ADD CONSTRAINT fk_platform_plan 
FOREIGN KEY (platform_subscription_plan_id) 
REFERENCES subscription_plans(id);

-- Subscribers
CREATE TABLE subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telegram_user_id BIGINT NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    bot_id UUID NOT NULL REFERENCES selling_bots(id) ON DELETE CASCADE,
    subscription_status subscription_status DEFAULT 'PENDING_PAYMENT',
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(telegram_user_id, bot_id)
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_type payment_type NOT NULL,
    subscriber_id UUID REFERENCES subscribers(id),
    client_id UUID REFERENCES clients(id),
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    nowpayments_invoice_id TEXT UNIQUE,
    nowpayments_payment_id TEXT,
    amount DECIMAL(18, 8) NOT NULL,
    currency TEXT NOT NULL,
    payment_address TEXT,
    transaction_hash TEXT,
    payment_status payment_status DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Access Control Logs
CREATE TABLE access_control_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id UUID NOT NULL REFERENCES subscribers(id) ON DELETE CASCADE,
    bot_id UUID NOT NULL REFERENCES selling_bots(id) ON DELETE CASCADE,
    action access_action NOT NULL,
    performed_by performed_by NOT NULL,
    performer_id TEXT,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification Logs
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_type TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    days_remaining INTEGER,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_clients_telegram_user_id ON clients(telegram_user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_selling_bots_client_id ON selling_bots(client_id);
CREATE INDEX idx_selling_bots_status ON selling_bots(status);
CREATE INDEX idx_subscribers_bot_id ON subscribers(bot_id);
CREATE INDEX idx_subscribers_telegram_user_id ON subscribers(telegram_user_id);
CREATE INDEX idx_subscribers_status ON subscribers(subscription_status);
CREATE INDEX idx_payment_transactions_subscriber_id ON payment_transactions(subscriber_id);
CREATE INDEX idx_payment_transactions_client_id ON payment_transactions(client_id);
CREATE INDEX idx_payment_transactions_invoice_id ON payment_transactions(nowpayments_invoice_id);
CREATE INDEX idx_access_control_logs_subscriber_id ON access_control_logs(subscriber_id);
CREATE INDEX idx_access_control_logs_bot_id ON access_control_logs(bot_id);
CREATE INDEX idx_notification_logs_recipient ON notification_logs(recipient_id, notification_type);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE selling_bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_control_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for backend)
CREATE POLICY "Service role full access" ON platform_admins FOR ALL USING (true);
CREATE POLICY "Service role full access" ON clients FOR ALL USING (true);
CREATE POLICY "Service role full access" ON selling_bots FOR ALL USING (true);
CREATE POLICY "Service role full access" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "Service role full access" ON subscribers FOR ALL USING (true);
CREATE POLICY "Service role full access" ON payment_transactions FOR ALL USING (true);
CREATE POLICY "Service role full access" ON access_control_logs FOR ALL USING (true);
CREATE POLICY "Service role full access" ON notification_logs FOR ALL USING (true);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_selling_bots_updated_at BEFORE UPDATE ON selling_bots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_platform_admins_updated_at BEFORE UPDATE ON platform_admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
