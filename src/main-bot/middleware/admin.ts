/**
 * Admin Middleware
 * Checks if user is a platform administrator
 */

import { Middleware } from 'grammy';
import { config } from '../../shared/config/index.js';
import type { MainBotContext } from '../../shared/types/index.js';

export function setupAdminMiddleware(): Middleware<MainBotContext> {
  return async (ctx, next) => {
    if (ctx.from) {
      const userId = BigInt(ctx.from.id);
      ctx.isAdmin = config.PLATFORM_ADMIN_IDS.includes(userId);
    } else {
      ctx.isAdmin = false;
    }
    await next();
  };
}

/**
 * Guard: Only allow platform admins
 */
export function adminOnly(): Middleware<MainBotContext> {
  return async (ctx, next) => {
    if (!ctx.isAdmin) {
      await ctx.reply('⛔ This command is only available to platform administrators.');
      return;
    }
    await next();
  };
}
