/**
 * Main Bot Services (Supabase version)
 * Business logic for client and bot management
 */

import { supabase } from '../../database/index.js';
import { createLogger } from '../../shared/utils/logger.js';
import { addDays } from '../../shared/utils/date.js';

const logger = createLogger('main-bot-service');

/**
 * Get client statistics
 */
export async function getClientStats(clientId: string) {
  const [
    { count: botsCount },
    { count: activeSubscribers },
    { data: revenueData }
  ] = await Promise.all([
    supabase.from('selling_bots').select('*', { count: 'exact', head: true }).eq('client_id', clientId),
    supabase.from('subscribers').select('*', { count: 'exact', head: true })
      .eq('subscription_status', 'ACTIVE')
      .innerJoin('selling_bots', 'bot_id', 'id')
      .eq('selling_bots.client_id', clientId),
    supabase.from('payment_transactions').select('amount')
      .eq('payment_type', 'SUBSCRIBER_SUBSCRIPTION')
      .eq('payment_status', 'CONFIRMED')
      .innerJoin('subscribers', 'subscriber_id', 'id')
      .innerJoin('selling_bots', 'subscribers.bot_id', 'id')
      .eq('selling_bots.client_id', clientId),
  ]);

  const totalRevenue = (revenueData as any[])?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  return {
    botsCount: botsCount || 0,
    activeSubscribers: activeSubscribers || 0,
    totalRevenue,
  };
}

/**
 * Get bot statistics
 */
export async function getBotStats(botId: string) {
  const [
    { count: totalSubscribers },
    { count: activeSubscribers },
    { count: expiredSubscribers },
    { data: revenueData },
    { count: recentPayments },
  ] = await Promise.all([
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('bot_id', botId),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('bot_id', botId).eq('subscription_status', 'ACTIVE'),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('bot_id', botId).eq('subscription_status', 'EXPIRED'),
    supabase.from('payment_transactions').select('amount').eq('payment_status', 'CONFIRMED').eq('subscriber_id', botId), // Error here in previous code? Should be joined with subscribers
    supabase.from('payment_transactions').select('*', { count: 'exact', head: true })
      .eq('payment_status', 'CONFIRMED')
      .gte('confirmed_at', addDays(new Date(), -30).toISOString()),
  ]);

  // Fix revenue data query
  const { data: correctRevenue } = await supabase
    .from('payment_transactions')
    .select('amount')
    .eq('payment_status', 'CONFIRMED')
    .innerJoin('subscribers', 'subscriber_id', 'id')
    .eq('subscribers.bot_id', botId);

  const totalRevenue = (correctRevenue as any[])?.reduce((sum, item) => sum + Number(item.amount), 0) || 0;

  return {
    totalSubscribers: totalSubscribers || 0,
    activeSubscribers: activeSubscribers || 0,
    expiredSubscribers: expiredSubscribers || 0,
    totalRevenue,
    last30DaysPayments: recentPayments || 0,
  };
}

/**
 * Update bot settings
 */
export async function updateBotSettings(
  botId: string,
  settings: {
    welcomeMessage?: string;
    linkedChannelId?: bigint;
    linkedChannelUsername?: string;
  }
) {
  const updateData: any = {};
  if (settings.welcomeMessage) updateData.welcome_message = settings.welcomeMessage;
  if (settings.linkedChannelId) updateData.linked_channel_id = Number(settings.linkedChannelId);
  if (settings.linkedChannelUsername) updateData.linked_channel_username = settings.linkedChannelUsername;

  return supabase
    .from('selling_bots')
    .update(updateData)
    .eq('id', botId);
}

/**
 * Create subscription plan
 */
export async function createPlan(
  botId: string,
  data: {
    name: string;
    description?: string;
    durationDays: number;
    priceAmount: number;
    priceCurrency: string;
  }
) {
  const { data: plan, error } = await supabase
    .from('subscription_plans')
    .insert({
      bot_id: botId,
      plan_type: 'CLIENT',
      name: data.name,
      description: data.description,
      duration_days: data.durationDays,
      price_amount: data.priceAmount,
      price_currency: data.priceCurrency.toUpperCase(),
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    logger.error({ error, botId }, 'Failed to create plan');
    throw error;
  }

  logger.info({ planId: plan.id, botId, name: plan.name }, 'Plan created');
  return plan;
}

/**
 * Toggle plan active status
 */
export async function togglePlanStatus(planId: string): Promise<boolean> {
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('is_active')
    .eq('id', planId)
    .single();

  if (!plan) return false;

  await supabase
    .from('subscription_plans')
    .update({ is_active: !plan.is_active })
    .eq('id', planId);

  return true;
}
