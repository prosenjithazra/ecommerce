import { z } from 'zod';

// ==========================================
// Token/Auth Types
// ==========================================
export const QikinkTokenResponseSchema = z.object({
  ClientId: z.union([z.string(), z.number()]),
  Accesstoken: z.string(),
  expires_in: z.number().optional().default(3600),
});

export type QikinkTokenResponse = z.infer<typeof QikinkTokenResponseSchema>;

// ==========================================
// Product Types
// ==========================================
export const QikinkDesignSchema = z.object({
  design_code: z.string(),
  placement_sku: z.string().optional(),
  width_inches: z.string().optional(),
  height_inches: z.string().optional(),
  design_link: z.string().url(),
  mockup_link: z.string().url().optional(),
});

export type QikinkDesign = z.infer<typeof QikinkDesignSchema>;

export const QikinkLineItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().min(1),
  price: z.string(),
  search_from_my_products: z.union([z.literal(0), z.literal(1)]).optional().default(1),
  designs: z.array(QikinkDesignSchema).optional(),
});

export type QikinkLineItem = z.infer<typeof QikinkLineItemSchema>;

// ==========================================
// Order Types
// ==========================================
export const QikinkAddressSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().optional().default(''),
  address1: z.string().min(1),
  address2: z.string().optional().default(''),
  phone: z.string().min(5),
  email: z.string().email().optional().default('customer@example.com'),
  city: z.string().min(1),
  zip: z.string().min(3),
  province: z.string().min(1),
  country_code: z.string().length(2).default('IN'),
});

export type QikinkAddress = z.infer<typeof QikinkAddressSchema>;

export const QikinkCreateOrderInputSchema = z.object({
  order_number: z.string().min(1),
  qikink_shipping: z.union([z.literal(0), z.literal(1)]).optional().default(1),
  gateway: z.enum(['Prepaid', 'COD']),
  total_order_value: z.number().positive(),
  shipping_address: QikinkAddressSchema,
  line_items: z.array(QikinkLineItemSchema).min(1),
});

export type QikinkCreateOrderInput = z.infer<typeof QikinkCreateOrderInputSchema>;

export const QikinkCreateOrderResponseSchema = z.object({
  message: z.string().optional(),
  order_id: z.number().optional(),
  status_code: z.string().optional(),
  error: z.string().optional(),
});

export type QikinkCreateOrderResponse = z.infer<typeof QikinkCreateOrderResponseSchema>;

export const QikinkOrderDetailsSchema = z.object({
  order_id: z.number(),
  number: z.string(),
  created_on: z.string().optional(),
  status: z.string(),
  shipping_type: z.string().optional(),
  payment_type: z.string().optional(),
  total_order_value: z.string().optional(),
  shipping: z.object({
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    zip: z.string().nullable().optional(),
    province: z.string().nullable().optional(),
    country_code: z.string().nullable().optional(),
    awb: z.union([z.string(), z.number(), z.null()]).optional(),
    tracking_link: z.string().url().nullable().optional(),
  }).optional(),
});

export type QikinkOrderDetails = z.infer<typeof QikinkOrderDetailsSchema>;
