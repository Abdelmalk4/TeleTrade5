/**
 * Telegram Utilities
 * Shared Telegram Bot API helpers
 */

import { Bot, InlineKeyboard, type Context } from 'grammy';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('telegram');

/**
 * Create a chat invite link for a channel
 */
export async function createChannelInviteLink(
  bot: Bot<Context>,
  channelId: number | string,
  options?: {
    name?: string;
    expireDate?: number;
    memberLimit?: number;
  }
): Promise<string> {
  try {
    const invite = await bot.api.createChatInviteLink(channelId, {
      name: options?.name || 'Subscription access',
      expire_date: options?.expireDate,
      member_limit: options?.memberLimit || 1,
    });
    return invite.invite_link;
  } catch (error) {
    logger.error({ error, channelId }, 'Failed to create invite link');
    throw new Error('Failed to create channel invite link');
  }
}

/**
 * Remove user from a channel/group
 */
export async function removeUserFromChannel(
  bot: Bot<Context>,
  channelId: number | string,
  userId: number
): Promise<boolean> {
  try {
    await bot.api.banChatMember(channelId, userId, {
      until_date: Math.floor(Date.now() / 1000) + 60, // Ban for 1 minute then auto-unban
      revoke_messages: false,
    });
    // Immediately unban so they can rejoin if they resubscribe
    await bot.api.unbanChatMember(channelId, userId);
    return true;
  } catch (error) {
    logger.error({ error, channelId, userId }, 'Failed to remove user from channel');
    return false;
  }
}

/**
 * Approve a join request
 */
export async function approveJoinRequest(
  bot: Bot<Context>,
  channelId: number | string,
  userId: number
): Promise<boolean> {
  try {
    await bot.api.approveChatJoinRequest(channelId, userId);
    return true;
  } catch (error) {
    logger.error({ error, channelId, userId }, 'Failed to approve join request');
    return false;
  }
}

/**
 * Decline a join request
 */
export async function declineJoinRequest(
  bot: Bot<Context>,
  channelId: number | string,
  userId: number
): Promise<boolean> {
  try {
    await bot.api.declineChatJoinRequest(channelId, userId);
    return true;
  } catch (error) {
    logger.error({ error, channelId, userId }, 'Failed to decline join request');
    return false;
  }
}

/**
 * Check if bot is admin of a channel
 */
export async function isBotChannelAdmin(
  bot: Bot<Context>,
  channelId: number | string
): Promise<boolean> {
  try {
    const me = await bot.api.getMe();
    const member = await bot.api.getChatMember(channelId, me.id);
    return member.status === 'administrator' || member.status === 'creator';
  } catch (error) {
    logger.error({ error, channelId }, 'Failed to check bot admin status');
    return false;
  }
}

/**
 * Get channel info
 */
export async function getChannelInfo(
  bot: Bot<Context>,
  channelId: number | string
): Promise<{ id: number; title: string; username?: string } | null> {
  try {
    const chat = await bot.api.getChat(channelId);
    if (chat.type === 'channel' || chat.type === 'supergroup') {
      return {
        id: chat.id,
        title: chat.title,
        username: 'username' in chat ? chat.username : undefined,
      };
    }
    return null;
  } catch (error) {
    logger.error({ error, channelId }, 'Failed to get channel info');
    return null;
  }
}

/**
 * Create an inline keyboard from button rows
 */
export function createKeyboard(
  rows: Array<Array<{ text: string; callback_data?: string; url?: string }>>
): InlineKeyboard {
  const keyboard = new InlineKeyboard();
  for (const row of rows) {
    for (const button of row) {
      if (button.url) {
        keyboard.url(button.text, button.url);
      } else if (button.callback_data) {
        keyboard.text(button.text, button.callback_data);
      }
    }
    keyboard.row();
  }
  return keyboard;
}

/**
 * Send a message with error handling
 */
export async function safeSendMessage(
  bot: Bot<Context>,
  chatId: number | string,
  text: string,
  options?: {
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    reply_markup?: InlineKeyboard;
  }
): Promise<boolean> {
  try {
    await bot.api.sendMessage(chatId, text, {
      parse_mode: options?.parse_mode || 'Markdown',
      reply_markup: options?.reply_markup,
    });
    return true;
  } catch (error) {
    logger.error({ error, chatId }, 'Failed to send message');
    return false;
  }
}
