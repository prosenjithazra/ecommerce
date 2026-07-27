import { z } from 'zod';

// ==========================================
// Token/Auth Types
// ==========================================
export const QikinkTokenResponseSchema = z.object({
  ClientId: z.union([z.string(), z.number()]).optional(),
  Accesstoken: z.string().optional(),
  access_token: z.string().optional(),
  accessToken: z.string().optional(),
  expires_in: z.number().optional().default(3600),
}).transform((data) => ({
  ClientId: data.ClientId,
  Accesstoken: data.Accesstoken || data.access_token || data.accessToken || '',
  expires_in: data.expires_in ?? 3600,
}));

export type QikinkTokenResponse = z.infer<typeof QikinkTokenResponseSchema>;

// ==========================================
// Product Types
// ==========================================
export const QikinkDesignSchema = z.object({
  design_code: z.string(),
  placement_sku: z.string().optional().default('fr'),
  width_inches: z.union([z.string(), z.number()]).optional().default('10'),
  height_inches: z.union([z.string(), z.number()]).optional().default('12'),
  design_link: z.string().optional(),
  design_url: z.string().optional(),
  mockup_link: z.string().optional(),
  mockup_url: z.string().optional(),
}).transform((data) => ({
  design_code: data.design_code,
  placement_sku: data.placement_sku || 'fr',
  width_inches: String(data.width_inches || '10'),
  height_inches: String(data.height_inches || '12'),
  design_link: data.design_link || data.design_url || '',
  mockup_link: data.mockup_link || data.mockup_url || '',
}));

export type QikinkDesign = z.infer<typeof QikinkDesignSchema>;

export const QikinkLineItemSchema = z.object({
  sku: z.string(),
  quantity: z.union([z.number(), z.string()]).transform(val => String(val)),
  price: z.union([z.number(), z.string()]).transform(val => String(val)),
  search_from_my_products: z.union([z.literal(0), z.literal(1)]).optional().default(1),
  print_type_id: z.number().optional(),
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
  order_number: z.string().min(1).transform(val => val.replace(/[^a-zA-Z0-9]/g, '').slice(-15)),
  qikink_shipping: z.union([z.literal(0), z.literal(1), z.string()]).optional().transform(val => String(val ?? '1')),
  gateway: z.enum(['Prepaid', 'COD', 'PREPAID', 'cod', 'prepaid']),
  total_order_value: z.union([z.number(), z.string()]).transform(val => String(val)),
  shipping_address: QikinkAddressSchema,
  line_items: z.array(QikinkLineItemSchema).min(1),
});

export type QikinkCreateOrderInput = z.infer<typeof QikinkCreateOrderInputSchema>;

export const QikinkCreateOrderResponseSchema = z.object({
  message: z.string().optional(),
  order_id: z.union([z.number(), z.string()]).optional(),
  status_code: z.union([z.string(), z.number()]).optional(),
  error: z.string().optional(),
});

export type QikinkCreateOrderResponse = z.infer<typeof QikinkCreateOrderResponseSchema>;

export const QikinkOrderDetailsSchema = z.object({
  order_id: z.union([z.number(), z.string()]),
  number: z.union([z.string(), z.number(), z.null()]).optional(),
  created_on: z.string().nullable().optional(),
  live_date: z.string().nullable().optional(),
  status: z.string().nullable().optional().default('Processing'),
  shipping_type: z.string().nullable().optional(),
  payment_type: z.string().nullable().optional(),
  total_order_value: z.union([z.string(), z.number(), z.null()]).optional(),
  line_items: z.array(z.any()).nullable().optional(),
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
    tracking_link: z.union([z.string(), z.null()]).optional(),
  }).nullable().optional(),
});

export type QikinkOrderDetails = z.infer<typeof QikinkOrderDetailsSchema>;
