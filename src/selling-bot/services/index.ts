/**
 * Selling Bot Services (Supabase version)
 * Business logic for subscriber management
 */

import { supabase } from '../../database/index.js';
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('selling-bot-service');

/**
 * Get or create subscriber
 */
export async function getOrCreateSubscriber(
  botId: string,
  telegramUserId: bigint,
  userData: {
    username?: string;
    firstName?: string;
    lastName?: string;
  }
) {
  let { data: subscriber } = await supabase
    .from('subscribers')
    .select('*')
    .eq('telegram_user_id', Number(telegramUserId))
    .eq('bot_id', botId)
    .single();

  if (!subscriber) {
    const { data: newSubscriber, error } = await supabase
      .from('subscribers')
      .insert({
        telegram_user_id: Number(telegramUserId),
        bot_id: botId,
        username: userData.username ?? null,
        first_name: userData.firstName ?? null,
        last_name: userData.lastName ?? null,
        subscription_status: 'PENDING_PAYMENT',
      })
      .select()
      .single();

    if (error) {
      logger.error({ error, botId, telegramUserId }, 'Failed to create subscriber');
      throw error;
    }
    subscriber = newSubscriber;
    logger.info({ subscriberId: subscriber.id, botId }, 'New subscriber created');
  }

  return subscriber;
}

/**
 * Get subscriber with full details
 */
export async function getSubscriberDetails(subscriberId: string) {
  const { data: subscriber, error } = await supabase
    .from('subscribers')
    .select('*, subscription_plans(*), selling_bots(bot_username, linked_channel_username), payment_transactions(*)')
    .eq('id', subscriberId)
    .single();

  if (error) return null;
  return subscriber;
}

/**
 * Get active plans for a bot
 */
export async function getActivePlans(botId: string) {
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('bot_id', botId)
    .eq('plan_type', 'CLIENT')
    .eq('is_active', true)
    .order('price_amount', { ascending: true });

  return plans || [];
}

/**
 * Get pending payment for subscriber
 */
export async function getPendingPayment(subscriberId: string) {
  const { data: transaction } = await supabase
    .from('payment_transactions')
    .select('*, subscription_plans(*)')
    .eq('subscriber_id', subscriberId)
    .in('payment_status', ['PENDING', 'CONFIRMING'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return transaction;
}

/**
 * Check if subscriber has active subscription
 */
export async function hasActiveSubscription(subscriberId: string): Promise<boolean> {
  const { data: subscriber } = await supabase
    .from('subscribers')
    .select('subscription_status, subscription_end_date')
    .eq('id', subscriberId)
    .single();

  if (!subscriber) return false;

  return (
    subscriber.subscription_status === 'ACTIVE' &&
    subscriber.subscription_end_date !== null &&
    new Date(subscriber.subscription_end_date) > new Date()
  );
}
