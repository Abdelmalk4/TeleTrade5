/**
 * Subscription Status Handler
 * Shows current subscription details
 */

import { Bot, InlineKeyboard } from 'grammy';
import type { SellingBotContext } from '../../../shared/types/index.js';
import { withFooter, formatDate, daysUntil, getRelativeTime } from '../../../shared/utils/index.js';

export function setupStatusHandler(bot: Bot<SellingBotContext>) {
  bot.command('status', async (ctx) => {
    await showStatus(ctx);
  });

  bot.callbackQuery('my_subscription', async (ctx) => {
    await ctx.answerCallbackQuery();
    await showStatus(ctx);
  });
}

async function showStatus(ctx: SellingBotContext) {
  const subscriber = ctx.subscriber;

  if (!subscriber) {
    await ctx.reply('❌ Could not load your subscription data.');
    return;
  }

  const keyboard = new InlineKeyboard();

  if (subscriber.subscriptionStatus === 'ACTIVE' && subscriber.subscriptionEndDate) {
    const daysLeft = daysUntil(subscriber.subscriptionEndDate);
    const expiresOn = formatDate(subscriber.subscriptionEndDate);
    const relativeTime = getRelativeTime(subscriber.subscriptionEndDate);

    keyboard
      .text('🔄 Renew Now', 'plans')
      .row()
      .text('« Back', 'start');

    const message = `
📊 *Your Subscription*

✅ *Status:* Active
📅 *Expires:* ${expiresOn}
⏱️ *Time Left:* ${relativeTime}

${daysLeft <= 3 ? '⚠️ *Your subscription is expiring soon!*\n' : ''}
`;

    await ctx.reply(withFooter(message), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } else if (subscriber.subscriptionStatus === 'EXPIRED') {
    keyboard
      .text('📋 Subscribe Now', 'plans')
      .row()
      .text('« Back', 'start');

    const message = `
📊 *Your Subscription*

⚠️ *Status:* Expired

Your subscription has expired. Subscribe now to regain access!
`;

    await ctx.reply(withFooter(message), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } else if (subscriber.subscriptionStatus === 'REVOKED') {
    keyboard.text('❓ Contact Support', 'help');

    const message = `
📊 *Your Subscription*

🚫 *Status:* Access Revoked

Your access has been revoked. Please contact support for assistance.
`;

    await ctx.reply(withFooter(message), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } else {
    // PENDING_PAYMENT
    keyboard
      .text('📋 View Plans', 'plans')
      .row()
      .text('« Back', 'start');

    const message = `
📊 *Your Subscription*

⏳ *Status:* No Active Subscription

You don't have an active subscription yet.
Choose a plan to get started!
`;

    await ctx.reply(withFooter(message), {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  }
}
