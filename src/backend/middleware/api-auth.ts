/**
 * API Authentication Middleware
 * Validates the x-api-key header for API routes
 */

import { FastifyReply, FastifyRequest } from 'fastify';
import { timingSafeEqual } from 'crypto';
import { config } from '../../shared/config/index.js';
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('api-auth');

/**
 * Constant-time string comparison to prevent timing attacks
 */
function secureCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    // Ensure we always do a comparison to maintain constant time
    if (bufA.length !== bufB.length) {
      timingSafeEqual(bufA, bufA);
      return false;
    }
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function authenticateApi(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Skip auth for health check and webhooks (webhooks have their own signature validation)
  if (
    request.url === '/health' ||
    request.url.startsWith('/webhooks/')
  ) {
    return;
  }

  const apiKey = request.headers['x-api-key'] as string | undefined;

  if (!apiKey || !secureCompare(apiKey, config.ADMIN_API_KEY)) {
    logger.warn(
      { 
        ip: request.ip, 
        path: request.url,
        userAgent: request.headers['user-agent'] 
      }, 
      'Unauthorized API access attempt'
    );
    
    reply.status(401).send({ 
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
    return; // CRITICAL: Must return to stop request processing
  }
}
