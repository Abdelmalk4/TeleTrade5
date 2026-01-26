/**
 * Admin Handlers - Platform Administration (Supabase version)
 */

import { Bot, InlineKeyboard } from 'grammy';
import type { MainBotContext } from '../../../shared/types/index.js';
import { supabase } from '../../../database/index.js';
import { mainBotLogger as logger, withFooter, formatDate } from '../../../shared/utils/index.js';
import { adminOnly } from '../../middleware/admin.js';

export function setupAdminHandlers(bot: Bot<MainBotContext>) {
  // Admin clients list
  bot.callbackQuery('admin_clients', adminOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    await showClientsList(ctx);
  });

  // Pending approvals
  bot.callbackQuery('admin_pending', adminOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    await showPendingApprovals(ctx);
  });

  // Platform stats
  bot.callbackQuery('admin_stats', adminOnly(), async (ctx) => {
    await ctx.answerCallbackQuery();
    await showPlatformStats(ctx);
  });

  // Approve client
  bot.callbackQuery(/^approve_client:(.+)$/, adminOnly(), async (ctx) => {
    const clientId = ctx.match[1];
    await ctx.answerCallbackQuery('Approving...');
    await approveClient(ctx, clientId);
  });

  // Suspend client
  bot.callbackQuery(/^suspend_client:(.+)$/, adminOnly(), async (ctx) => {
    const clientId = ctx.match[1];
    await ctx.answerCallbackQuery();
    await showSuspendConfirm(ctx, clientId);
  });

  // View client details
  bot.callbackQuery(/^view_client:(.+)$/, adminOnly(), async (ctx) => {
    const clientId = ctx.match[1];
    await ctx.answerCallbackQuery();
    await showClientDetails(ctx, clientId);
  });
}

async function showClientsList(ctx: MainBotContext) {
  const { data: clients, error } = await supabase
    .from('clients')
    .select(`
      *,
      selling_bots(count)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !clients || clients.length === 0) {
    await ctx.reply('📭 No clients registered yet.');
    return;
  }

  const keyboard = new InlineKeyboard();

  for (const client of clients) {
    const statusEmoji = getStatusEmoji(client.status);
    const botCount = (client.selling_bots as any)?.[0]?.count || 0;
    keyboard.text(
      `${statusEmoji} ${client.business_name} (${botCount} bots)`,
      `view_client:${client.id}`
    ).row();
  }

  keyboard.text('« Back to Dashboard', 'start');

  await ctx.reply(
    withFooter('👥 *All Clients*\n\nSelect a client to view details:'),
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
}

async function showPendingApprovals(ctx: MainBotContext) {
  const { data: pending, error } = await supabase
    .from('clients')
    .select('*')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: true });

  if (error || !pending || pending.length === 0) {
    const keyboard = new InlineKeyboard().text('« Back', 'start');
    await ctx.reply(
      withFooter('✅ No pending approvals!'),
      { parse_mode: 'Markdown', reply_markup: keyboard }
    );
    return;
  }

  const keyboard = new InlineKeyboard();

  for (const client of pending) {
    keyboard.text(
      `📋 ${client.business_name}`,
      `view_client:${client.id}`
    ).row();
  }

  keyboard.text('« Back', 'start');

  await ctx.reply(
    withFooter(`📋 *Pending Approvals (${pending.length})*\n\nReview and approve new clients:`),
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
}

async function showPlatformStats(ctx: MainBotContext) {
  const [
    { count: totalClients },
    { count: activeClients },
    { count: trialClients },
    { count: pendingClients },
    { count: totalBots },
    { count: activeBots },
    { count: totalSubscribers },
    { count: activeSubscribers },
    { count: todayPayments },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'TRIAL'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    supabase.from('selling_bots').select('*', { count: 'exact', head: true }),
    supabase.from('selling_bots').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE'),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('subscription_status', 'ACTIVE'),
    supabase.from('payment_transactions').select('*', { count: 'exact', head: true })
      .eq('payment_status', 'CONFIRMED')
      .gte('confirmed_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
  ]);

  const keyboard = new InlineKeyboard()
    .text('🔄 Refresh', 'admin_stats')
    .text('« Back', 'start');

  const message = `
📈 *Platform Statistics*

*Clients:*
• Total: ${totalClients || 0}
• Active: ${activeClients || 0}
• Trial: ${trialClients || 0}
• Pending: ${pendingClients || 0}

*Selling Bots:*
• Total: ${totalBots || 0}
• Active: ${activeBots || 0}

*Subscribers:*
• Total: ${totalSubscribers || 0}
• Active: ${activeSubscribers || 0}

*Today's Payments:* ${todayPayments || 0}
`;

  await ctx.reply(withFooter(message), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}

async function showClientDetails(ctx: MainBotContext, clientId: string) {
  const { data: client, error } = await supabase
    .from('clients')
    .select('*, selling_bots(id, bot_username, status), subscription_plans(*)')
    .eq('id', clientId)
    .single();

  if (error || !client) {
    await ctx.reply('❌ Client not found');
    return;
  }

  const keyboard = new InlineKeyboard();

  if (client.status === 'PENDING') {
    keyboard.text('✅ Approve', `approve_client:${client.id}`);
  }
  if (client.status !== 'SUSPENDED') {
    keyboard.text('🚫 Suspend', `suspend_client:${client.id}`);
  }
  keyboard.row().text('« Back to Clients', 'admin_clients');

  const botsInfo = client.selling_bots && (client.selling_bots as any[]).length > 0
    ? (client.selling_bots as any[]).map((b) => `  • @${b.bot_username} (${b.status})`).join('\n')
    : '  None';

  const message = `
👤 *Client Details*

*Business:* ${client.business_name}
*Status:* ${getStatusEmoji(client.status)} ${client.status}
*Channel:* @${client.channel_username || 'Not set'}
*Email:* ${client.contact_email || 'Not provided'}
*Registered:* ${formatDate(new Date(client.created_at))}

*Trial:*
${client.trial_activated
    ? `Started: ${formatDate(new Date(client.trial_start_date!))}\nEnds: ${formatDate(new Date(client.trial_end_date!))}`
    : 'Not started'}

*Selling Bots (${(client.selling_bots as any[])?.length || 0}):*
${botsInfo}
`;

  await ctx.reply(withFooter(message), {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });
}

async function approveClient(ctx: MainBotContext, clientId: string) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .update({ status: 'PENDING' })
      .eq('id', clientId)
      .select()
      .single();

    if (error || !client) throw error || new Error('Client not found');

    // Notify client
    const { Bot } = await import('grammy');
    const { config } = await import('../../../shared/config/index.js');
    const mainBot = new Bot(config.MAIN_BOT_TOKEN);

    await mainBot.api.sendMessage(
      Number(client.telegram_user_id),
      withFooter(`
🎉 *Account Approved!*

Your account has been approved and is ready to use.

*Next steps:*
1. Create your first Selling Bot
2. Configure subscription plans
3. Link your Telegram channel
4. Start accepting subscribers!

Use /start to begin.
`),
      { parse_mode: 'Markdown' }
    );

    await ctx.reply(`✅ Client "${client.business_name}" approved and notified.`);
    logger.info({ clientId }, 'Client approved by admin');
  } catch (error) {
    logger.error({ error, clientId }, 'Failed to approve client');
    await ctx.reply('❌ Failed to approve client.');
  }
}

async function showSuspendConfirm(ctx: MainBotContext, clientId: string) {
  const { data: client } = await supabase
    .from('clients')
    .select('business_name')
    .eq('id', clientId)
    .single();

  if (!client) {
    await ctx.reply('❌ Client not found');
    return;
  }

  const keyboard = new InlineKeyboard()
    .text('🚫 Confirm Suspend', `confirm_suspend:${clientId}`)
    .text('❌ Cancel', `view_client:${clientId}`);

  await ctx.reply(
    `⚠️ *Suspend Client*\n\nAre you sure you want to suspend "${client.business_name}"?\n\nThis will pause all their selling bots.`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  );
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'ACTIVE': return '✅';
    case 'TRIAL': return '🆓';
    case 'PENDING': return '⏳';
    case 'EXPIRED': return '⚠️';
    case 'SUSPENDED': return '🚫';
    default: return '❓';
  }
}
