/**
 * Backend Entry Point
 * Core API server with webhooks and scheduled jobs
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config, isDevelopment } from '../shared/config/index.js';
import { createLogger } from '../shared/utils/logger.js';

// Import routes
import { registerWebhookRoutes } from './webhooks/nowpayments/handler.js';
import { registerApiRoutes } from './api/index.js';

// Import jobs
import { startScheduledJobs } from './jobs/index.js';

const logger = createLogger('backend');

// Create Fastify instance
const app = Fastify({
  logger: isDevelopment,
});

// Middleware
await app.register(cors, {
  origin: true,
});

// Health check
app.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}));

// Register routes
registerWebhookRoutes(app);
registerApiRoutes(app);

// Start server
async function start() {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = '0.0.0.0';

    await app.listen({ port, host });
    logger.info({ port, host }, 'Backend server started');

    // Start scheduled jobs
    startScheduledJobs();
    logger.info('Scheduled jobs started');

  } catch (error) {
    logger.fatal({ error }, 'Failed to start backend');
    process.exit(1);
  }
}

start();

export default app;
