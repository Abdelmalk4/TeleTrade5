/**
 * Client Settings Handler - Complete Implementation
 */

import { Bot, InlineKeyboard } from 'grammy';
import type { MainBotContext } from '../../../shared/types/index.js';
import { supabase, type Client } from '../../../database/index.js';
import { withFooter, escapeHtml } from '../../../shared/utils/index.js';
import { mainBotLogger as logger } from '../../../shared/utils/index.js';
import { clientOnly } from '../../middleware/client.js';

// Extended session type for settings
interface SettingsSession {
  editingField?: 'business_name' | 'email';
}

export function setupSettingsHandler(bot: Bot<MainBotContext>) {
  bot.callbackQuery('settings', clientOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    await showSettings(ctx);
  });

  // Edit Business Name - prompt
  bot.callbackQuery('edit_business_name', clientOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    (ctx.session as any).editingField = 'business_name';
    await ctx.reply(withFooter(`
✏️ <b>Edit Business Name</b>

Send your new business name:

<i>Current: ${escapeHtml(ctx.client?.businessName || '')}</i>

Or send /cancel to go back.
    `), { parse_mode: 'HTML' });
  });

  // Edit Email - prompt
  bot.callbackQuery('edit_email', clientOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    (ctx.session as any).editingField = 'email';
    await ctx.reply(withFooter(`
📧 <b>Edit Contact Email</b>

Send your new email address:

Or send /cancel to go back.
    `), { parse_mode: 'HTML' });
  });

  // Notification settings
  bot.callbackQuery('notification_settings', clientOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    const keyboard = new InlineKeyboard()
      .text('🔔 Enable All', 'notif_enable_all')
      .text('🔕 Disable All', 'notif_disable_all')
      .row()
      .text('« Back to Settings', 'settings');

    await ctx.reply(withFooter(`
🔔 <b>Notification Settings</b>

Configure when you receive notifications:

• <b>New Subscribers</b> - When someone subscribes
• <b>Payments</b> - When payments are confirmed
• <b>Expirations</b> - When subscriptions expire

<i>Feature coming soon!</i>
    `), { parse_mode: 'HTML', reply_markup: keyboard });
  });

  // Handle text input for editing fields
  bot.on('message:text', async (ctx, next) => {
    const session = ctx.session as any;
    const editingField = session.editingField;
    
    if (!editingField || !ctx.client) {
      await next();
      return;
    }

    const text = ctx.message.text.trim();

    if (text === '/cancel') {
      session.editingField = undefined;
      await showSettings(ctx);
      return;
    }

    try {
      if (editingField === 'business_name') {
        if (text.length < 2 || text.length > 100) {
          await ctx.reply('❌ Business name must be 2-100 characters. Please try again or /cancel.');
          return;
        }

        await (supabase.from('clients') as any)
          .update({ business_name: text })
          .eq('id', ctx.client.id);

        session.editingField = undefined;
        await ctx.reply(`✅ Business name updated to: <b>${escapeHtml(text)}</b>`, { parse_mode: 'HTML' });
        
        // Refresh client data in context
        ctx.client.businessName = text;
        await showSettings(ctx);
      } else if (editingField === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          await ctx.reply('❌ Invalid email format. Please try again or /cancel.');
          return;
        }

        await (supabase.from('clients') as any)
          .update({ contact_email: text })
          .eq('id', ctx.client.id);

        session.editingField = undefined;
        await ctx.reply(`✅ Email updated to: <b>${escapeHtml(text)}</b>`, { parse_mode: 'HTML' });
        await showSettings(ctx);
      }
    } catch (error) {
      logger.error({ error }, 'Failed to update client setting');
      session.editingField = undefined;
      await ctx.reply('❌ Failed to save. Please try again.');
    }
  });
}

async function showSettings(ctx: MainBotContext) {
  const client = ctx.client!;

  // Fetch fresh client data
  const { data } = await supabase
    .from('clients')
    .select('business_name, contact_email, username, status')
    .eq('id', client.id)
    .single();

  const freshClient = data as Pick<Client, 'business_name' | 'contact_email' | 'username' | 'status'> | null;

  const keyboard = new InlineKeyboard()
    .text('✏️ Edit Business Name', 'edit_business_name')
    .row()
    .text('📧 Edit Email', 'edit_email')
    .row()
    .text('🔔 Notifications', 'notification_settings')
    .row()
    .text('« Back', 'start');

  await ctx.reply(withFooter(`
⚙️ <b>Account Settings</b>

<b>Business Name:</b> ${escapeHtml(freshClient?.business_name || client.businessName)}
<b>Email:</b> ${escapeHtml(freshClient?.contact_email || 'Not set')}
<b>Username:</b> ${freshClient?.username ? `@${escapeHtml(freshClient.username)}` : 'Not set'}
<b>Status:</b> ${freshClient?.status || client.status}

Select an option to edit:
  `), {
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });
}
