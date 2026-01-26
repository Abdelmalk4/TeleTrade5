/**
 * Help Command Handler
 */

import { Bot, InlineKeyboard } from 'grammy';
import type { MainBotContext } from '../../../shared/types/index.js';
import { PLATFORM } from '../../../shared/config/index.js';
import { withFooter } from '../../../shared/utils/index.js';

export function setupHelpCommand(bot: Bot<MainBotContext>) {
  bot.command('help', async (ctx) => {
    await showHelp(ctx);
  });

  bot.callbackQuery('help', async (ctx) => {
    await ctx.answerCallbackQuery();
    await showHelp(ctx);
  });
}

async function showHelp(ctx: MainBotContext) {
  const keyboard = new InlineKeyboard()
    .text('📖 Getting Started', 'help_getting_started')
    .row()
    .text('🤖 Bot Setup', 'help_bot_setup')
    .text('💳 Payments', 'help_payments')
    .row()
    .text('👥 Subscribers', 'help_subscribers')
    .text('⚙️ Settings', 'help_settings')
    .row()
    .text('📧 Contact Support', 'contact_support')
    .row()
    .text('« Back to Menu', 'start');

  const message = `
❓ *Help Center*

Welcome to ${PLATFORM.NAME} Help!

Select a topic below to learn more:

• *Getting Started* - New user guide
• *Bot Setup* - Create and configure selling bots
• *Payments* - NOWPayments and subscriptions
• *Subscribers* - Manage your subscribers
• *Settings* - Platform configuration

Need more help? Contact our support team.
`;

  await ctx.reply(withFooter(message), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}
