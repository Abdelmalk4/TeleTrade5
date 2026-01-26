/**
 * Main Bot Keyboards
 * Reusable inline keyboards
 */

import { InlineKeyboard } from 'grammy';

// Main menu for new users
export function getWelcomeKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('🚀 Register Now', 'register')
    .row()
    .text('📖 Learn More', 'learn_more');
}

// Dashboard for clients
export function getClientDashboardKeyboard(status: string): InlineKeyboard {
  const keyboard = new InlineKeyboard()
    .text('🤖 My Bots', 'my_bots')
    .text('📊 Analytics', 'analytics')
    .row()
    .text('💳 Subscription', 'subscription')
    .text('⚙️ Settings', 'settings')
    .row()
    .text('❓ Help', 'help');

  if (status === 'EXPIRED') {
    keyboard.row().text('🔄 Renew Now', 'platform_plans');
  }

  return keyboard;
}

// Admin dashboard
export function getAdminDashboardKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('👥 All Clients', 'admin_clients')
    .text('📈 Platform Stats', 'admin_stats')
    .row()
    .text('⚙️ Settings', 'admin_settings')
    .text('📋 Pending', 'admin_pending')
    .row()
    .text('🔍 Search', 'admin_search');
}

// Back buttons
export function getBackButton(target: string, label = '« Back'): InlineKeyboard {
  return new InlineKeyboard().text(label, target);
}

// Confirmation keyboard
export function getConfirmKeyboard(
  confirmCallback: string,
  cancelCallback: string
): InlineKeyboard {
  return new InlineKeyboard()
    .text('✅ Confirm', confirmCallback)
    .text('❌ Cancel', cancelCallback);
}

// Pagination keyboard
export function getPaginationKeyboard(
  baseCallback: string,
  currentPage: number,
  totalPages: number
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  if (currentPage > 1) {
    keyboard.text('« Prev', `${baseCallback}:${currentPage - 1}`);
  }

  keyboard.text(`${currentPage}/${totalPages}`, 'noop');

  if (currentPage < totalPages) {
    keyboard.text('Next »', `${baseCallback}:${currentPage + 1}`);
  }

  return keyboard;
}
