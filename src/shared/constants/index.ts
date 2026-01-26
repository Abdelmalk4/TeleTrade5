/**
 * Constants Index
 */

// Status emojis
export const STATUS_EMOJI = {
  ACTIVE: '✅',
  TRIAL: '🆓',
  PENDING: '⏳',
  EXPIRED: '⚠️',
  SUSPENDED: '🚫',
  PAUSED: '⏸️',
} as const;

// Subscription status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  REVOKED: 'REVOKED',
} as const;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMING: 'CONFIRMING',
  CONFIRMED: 'CONFIRMED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
  REFUNDED: 'REFUNDED',
} as const;

// Bot commands
export const COMMANDS = {
  START: 'start',
  HELP: 'help',
  PLANS: 'plans',
  STATUS: 'status',
  RENEW: 'renew',
  SUPPORT: 'support',
  SUBSCRIPTION: 'subscription',
} as const;

// Callback prefixes
export const CALLBACK = {
  VIEW_CLIENT: 'view_client',
  APPROVE_CLIENT: 'approve_client',
  SUSPEND_CLIENT: 'suspend_client',
  VIEW_BOT: 'view_bot',
  TOGGLE_BOT: 'toggle_bot',
  SELECT_PLAN: 'select_plan',
  CREATE_INVOICE: 'create_invoice',
  CHECK_PAYMENT: 'check_payment',
} as const;
