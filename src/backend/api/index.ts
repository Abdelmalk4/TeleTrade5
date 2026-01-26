/**
 * API Routes Index
 */

import { FastifyInstance } from 'fastify';
import { registerClientRoutes } from './clients/index.js';
import { registerBotRoutes } from './bots/index.js';
import { registerSubscriberRoutes } from './subscribers/index.js';
import { registerPlanRoutes } from './plans/index.js';

export function registerApiRoutes(app: FastifyInstance): void {
  // API prefix
  app.register(async (api) => {
    registerClientRoutes(api);
    registerBotRoutes(api);
    registerSubscriberRoutes(api);
    registerPlanRoutes(api);
  }, { prefix: '/api' });
}
