/**
 * Client API Routes (Supabase version)
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { supabase } from '../../../database/index.js';
import { createLogger } from '../../../shared/utils/logger.js';

const logger = createLogger('api-clients');

export function registerClientRoutes(app: FastifyInstance): void {
  // Get all clients
  app.get('/clients', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { data: clients } = await supabase
        .from('clients')
        .select('*, selling_bots(count)')
        .order('created_at', { ascending: false });

      return { clients };
    } catch (error) {
      logger.error({ error }, 'Failed to get clients');
      return reply.status(500).send({ error: 'Failed to get clients' });
    }
  });

  // Get client by ID
  app.get<{ Params: { id: string } }>('/clients/:id', async (request, reply) => {
    try {
      const { data: client } = await supabase
        .from('clients')
        .select('*, selling_bots(*), subscription_plans(*)')
        .eq('id', request.params.id)
        .single();

      if (!client) {
        return reply.status(404).send({ error: 'Client not found' });
      }

      return { client };
    } catch (error) {
      logger.error({ error }, 'Failed to get client');
      return reply.status(500).send({ error: 'Failed to get client' });
    }
  });

  // Approve client
  app.post<{ Params: { id: string } }>('/clients/:id/approve', async (request, reply) => {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .update({ status: 'PENDING' })
        .eq('id', request.params.id)
        .select()
        .single();

      if (error) throw error;

      logger.info({ clientId: client.id }, 'Client approved');
      return { success: true, client };
    } catch (error) {
      logger.error({ error }, 'Failed to approve client');
      return reply.status(500).send({ error: 'Failed to approve client' });
    }
  });

  // Suspend client
  app.post<{ Params: { id: string }; Body: { reason?: string } }>(
    '/clients/:id/suspend',
    async (request, reply) => {
      try {
        await supabase
          .from('clients')
          .update({ status: 'SUSPENDED' })
          .eq('id', request.params.id);

        await supabase
          .from('selling_bots')
          .update({ status: 'PAUSED' })
          .eq('client_id', request.params.id);

        logger.info({ clientId: request.params.id }, 'Client suspended');
        return { success: true };
      } catch (error) {
        logger.error({ error }, 'Failed to suspend client');
        return reply.status(500).send({ error: 'Failed to suspend client' });
      }
    }
  );

  // Get platform stats
  app.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [clients, bots, subs] = await Promise.all([
        supabase.from('clients').select('status'),
        supabase.from('selling_bots').select('status'),
        supabase.from('subscribers').select('subscription_status'),
      ]);

      const clientData = clients.data || [];
      const botData = bots.data || [];
      const subData = subs.data || [];

      return {
        clients: {
          total: clientData.length,
          active: clientData.filter((c) => c.status === 'ACTIVE').length,
          trial: clientData.filter((c) => c.status === 'TRIAL').length,
        },
        bots: {
          total: botData.length,
          active: botData.filter((b) => b.status === 'ACTIVE').length,
        },
        subscribers: {
          total: subData.length,
          active: subData.filter((s) => s.subscription_status === 'ACTIVE').length,
        },
      };
    } catch (error) {
      logger.error({ error }, 'Failed to get stats');
      return reply.status(500).send({ error: 'Failed to get stats' });
    }
  });
}
