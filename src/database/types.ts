/**
 * Database Types for Supabase
 * TypeScript types matching the SQL schema
 */

// Enum types
export type ClientStatus = 'PENDING' | 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED';
export type BotStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT' | 'REVOKED';
export type PlanType = 'PLATFORM' | 'CLIENT';
export type PaymentStatus = 'PENDING' | 'CONFIRMING' | 'CONFIRMED' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
export type PaymentType = 'SUBSCRIBER_SUBSCRIPTION' | 'PLATFORM_SUBSCRIPTION';
export type AccessAction = 'GRANT' | 'REVOKE' | 'MANUAL_EXTEND' | 'MANUAL_REVOKE';
export type PerformedBy = 'SYSTEM' | 'CLIENT' | 'ADMIN';
export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT';

// Table types
export interface PlatformAdmin {
  id: string;
  telegram_user_id: number;
  username: string | null;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  telegram_user_id: number;
  username: string | null;
  business_name: string;
  contact_email: string | null;
  channel_username: string | null;
  status: ClientStatus;
  trial_start_date: string | null;
  trial_end_date: string | null;
  trial_activated: boolean;
  platform_subscription_plan_id: string | null;
  platform_subscription_start: string | null;
  platform_subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellingBot {
  id: string;
  client_id: string;
  bot_token: string;
  bot_username: string | null;
  bot_name: string | null;
  nowpayments_api_key: string;
  crypto_wallet_address: string;
  linked_channel_id: number | null;
  linked_channel_username: string | null;
  welcome_message: string | null;
  status: BotStatus;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  plan_type: PlanType;
  bot_id: string | null;
  name: string;
  description: string | null;
  duration_days: number;
  price_amount: number;
  price_currency: string;
  max_bots: number | null;
  max_subscribers: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: string;
  telegram_user_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  bot_id: string;
  subscription_status: SubscriptionStatus;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  subscription_plan_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  payment_type: PaymentType;
  subscriber_id: string | null;
  client_id: string | null;
  plan_id: string;
  nowpayments_invoice_id: string | null;
  nowpayments_payment_id: string | null;
  amount: number;
  currency: string;
  payment_address: string | null;
  transaction_hash: string | null;
  payment_status: PaymentStatus;
  created_at: string;
  confirmed_at: string | null;
  updated_at: string;
  expires_at: string | null;
}

export interface AccessControlLog {
  id: string;
  subscriber_id: string;
  bot_id: string;
  action: AccessAction;
  performed_by: PerformedBy;
  performer_id: string | null;
  reason: string | null;
  created_at: string;
}

export interface NotificationLog {
  id: string;
  recipient_type: string;
  recipient_id: string;
  notification_type: string;
  days_remaining: number | null;
  sent_at: string;
  success: boolean;
  error_message: string | null;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      platform_admins: {
        Row: PlatformAdmin;
        Insert: Omit<PlatformAdmin, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PlatformAdmin, 'id'>>;
      };
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Client, 'id'>>;
      };
      selling_bots: {
        Row: SellingBot;
        Insert: Omit<SellingBot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SellingBot, 'id'>>;
      };
      subscription_plans: {
        Row: SubscriptionPlan;
        Insert: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SubscriptionPlan, 'id'>>;
      };
      subscribers: {
        Row: Subscriber;
        Insert: Omit<Subscriber, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Subscriber, 'id'>>;
      };
      payment_transactions: {
        Row: PaymentTransaction;
        Insert: Omit<PaymentTransaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PaymentTransaction, 'id'>>;
      };
      access_control_logs: {
        Row: AccessControlLog;
        Insert: Omit<AccessControlLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AccessControlLog, 'id'>>;
      };
      notification_logs: {
        Row: NotificationLog;
        Insert: Omit<NotificationLog, 'id' | 'sent_at'>;
        Update: Partial<Omit<NotificationLog, 'id'>>;
      };
    };
  };
}
