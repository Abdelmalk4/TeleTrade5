/**
 * Subscriber API Routes (Supabase version)
 */

import { FastifyInstance } from 'fastify';
import { supabase } from '../../../database/index.js';
import { createLogger } from '../../../shared/utils/logger.js';
import { manualExtendAccess, manualRevokeAccess } from '../../services/access-control/index.js';

const logger = createLogger('api-subscribers');

export function registerSubscriberRoutes(app: FastifyInstance): void {
  // Get subscriber by ID
  app.get<{ Params: { id: string } }>('/subscribers/:id', async (request, reply) => {
    try {
      const { data: subscriber } = await supabase
        .from('subscribers')
        .select('*, subscription_plans(*), payment_transactions(*), access_control_logs(*)')
        .eq('id', request.params.id)
        .single();

      if (!subscriber) {
        return reply.status(404).send({ error: 'Subscriber not found' });
      }

      return { subscriber };
    } catch (error) {
      logger.error({ error }, 'Failed to get subscriber');
      return reply.status(500).send({ error: 'Failed to get subscriber' });
    }
  });

  // Extend subscriber access
  app.post<{
    Params: { id: string };
    Body: { days: number; reason?: string; performerId: string; performerType: 'CLIENT' | 'ADMIN' };
  }>('/subscribers/:id/extend', async (request, reply) => {
    try {
      const { days, reason, performerId, performerType } = request.body;

      const success = await manualExtendAccess(
        request.params.id,
        days,
        performerId,
        performerType,
        reason
      );

      if (!success) {
        return reply.status(400).send({ error: 'Failed to extend access' });
      }

      logger.info({ subscriberId: request.params.id, days }, 'Access extended via API');
      return { success: true };
    } catch (error) {
      logger.error({ error }, 'Failed to extend access');
      return reply.status(500).send({ error: 'Failed to extend access' });
    }
  });

  // Revoke subscriber access
  app.post<{
    Params: { id: string };
    Body: { reason: string; performerId: string; performerType: 'CLIENT' | 'ADMIN' };
  }>('/subscribers/:id/revoke', async (request, reply) => {
    try {
      const { reason, performerId, performerType } = request.body;

      const success = await manualRevokeAccess(
        request.params.id,
        performerId,
        performerType,
        reason
      );

      if (!success) {
        return reply.status(400).send({ error: 'Failed to revoke access' });
      }

      logger.info({ subscriberId: request.params.id, reason }, 'Access revoked via API');
      return { success: true };
    } catch (error) {
      logger.error({ error }, 'Failed to revoke access');
      return reply.status(500).send({ error: 'Failed to revoke access' });
    }
  });
}
