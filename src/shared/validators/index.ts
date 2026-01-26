/**
 * Input Validators
 * Zod schemas for validating user input
 */

import { z } from 'zod';

// Client registration
export const registrationSchema = z.object({
  businessName: z.string().min(2).max(100),
  channelUsername: z.string().min(3).max(50),
  contactEmail: z.string().email().optional(),
});

// Bot creation
export const botCreationSchema = z.object({
  botToken: z.string().regex(/^\d+:[A-Za-z0-9_-]{35,}$/),
  nowpaymentsApiKey: z.string().min(20),
  cryptoWalletAddress: z.string().min(20),
});

// Subscription plan
export const planSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  durationDays: z.number().int().min(1).max(365),
  priceAmount: z.number().positive(),
  priceCurrency: z.enum(['USDT', 'BTC', 'ETH', 'LTC', 'USDC']),
});

// Manual access extension
export const extensionSchema = z.object({
  days: z.number().int().min(1).max(365),
  reason: z.string().max(500).optional(),
});

// Wallet address validation (basic)
export const walletSchema = z.object({
  address: z.string().min(20).max(100),
  currency: z.enum(['USDT', 'BTC', 'ETH', 'LTC', 'USDC']),
});

// Validate and return result
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: result.error.errors.map((e) => e.message).join(', '),
  };
}
