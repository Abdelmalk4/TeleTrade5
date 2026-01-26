/**
 * Selling Bot Keyboards
 * Reusable inline keyboards for subscriber interface
 */

import { InlineKeyboard } from 'grammy';

// Welcome menu for subscribers
export function getSubscriberWelcomeKeyboard(hasActiveSubscription: boolean): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (hasActiveSubscription) {
    keyboard
      .text('📊 My Subscription', 'my_subscription')
      .row()
      .text('🔄 Renew Now', 'plans')
      .row()
      .text('❓ Help', 'help');
  } else {
    keyboard
      .text('📋 View Plans', 'plans')
      .row()
      .text('📊 Check Status', 'my_subscription')
      .row()
      .text('❓ Help', 'help');
  }

  return keyboard;
}

// Plans list keyboard
export function getPlansKeyboard(
  plans: Array<{ id: string; buttonText: string }>
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const plan of plans) {
    keyboard.text(plan.buttonText, `select_plan:${plan.id}`).row();
  }

  keyboard.text('« Back', 'start');
  return keyboard;
}

// Payment keyboard
export function getPaymentKeyboard(
  invoiceUrl: string,
  transactionId: string
): InlineKeyboard {
  return new InlineKeyboard()
    .url('🌐 Pay on NOWPayments', invoiceUrl)
    .row()
    .text('🔄 Check Payment Status', `check_payment:${transactionId}`)
    .row()
    .text('❌ Cancel', 'plans');
}

// Subscription status keyboard
export function getSubscriptionKeyboard(status: string): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (status === 'ACTIVE') {
    keyboard.text('🔄 Renew Now', 'plans').row();
  } else if (status === 'EXPIRED' || status === 'PENDING_PAYMENT') {
    keyboard.text('📋 Subscribe Now', 'plans').row();
  } else if (status === 'REVOKED') {
    keyboard.text('❓ Contact Support', 'help');
    return keyboard;
  }

  keyboard.text('« Back', 'start');
  return keyboard;
}

// Help keyboard
export function getHelpKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📋 View Plans', 'plans')
    .text('📊 My Status', 'my_subscription')
    .row()
    .text('« Back', 'start');
}
