import { qikinkRequest } from './client';
import { QIKINK_ENDPOINTS } from './constants';
import { 
  QikinkCreateOrderInput, 
  QikinkCreateOrderInputSchema, 
  QikinkCreateOrderResponse, 
  QikinkCreateOrderResponseSchema,
  QikinkOrderDetails,
  QikinkOrderDetailsSchema
} from './types';

/**
 * Creates/Syncs a new order in the Qikink system.
 */
export async function createOrder(
  input: QikinkCreateOrderInput
): Promise<QikinkCreateOrderResponse> {
  const validatedInput = QikinkCreateOrderInputSchema.parse(input);

  const response = await qikinkRequest(QIKINK_ENDPOINTS.CREATE_ORDER, {
    method: 'POST',
    body: JSON.stringify(validatedInput),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qikink Order Creation Failed: ${response.status} - ${errorText}`);
  }

  const rawJson = await response.json();
  return QikinkCreateOrderResponseSchema.parse(rawJson);
}

/**
 * Retrieves the details of a single order by looking up the order list.
 */
export async function getOrderDetails(
  orderId: string
): Promise<QikinkOrderDetails> {
  const response = await qikinkRequest(QIKINK_ENDPOINTS.ORDERS, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Qikink Order Retrieval Failed: ${response.status} - ${errorText}`);
  }

  const rawList = await response.json();
  if (!Array.isArray(rawList)) {
    throw new Error('Qikink Order list request returned invalid format.');
  }

  // Find by order number (local ID) or internal Qikink order_id
  const order = rawList.find(
    (o: any) => o.number === orderId || o.order_id?.toString() === orderId
  );

  if (!order) {
    throw new Error(`Qikink Order "${orderId}" not found in account order history.`);
  }

  return QikinkOrderDetailsSchema.parse(order);
}

/**
 * Retrieves the status value of an order.
 */
export async function getOrderStatus(
  orderId: string
): Promise<string> {
  const details = await getOrderDetails(orderId);
  return details.status;
}
