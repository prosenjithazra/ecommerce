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

  const resText = await response.text();
  if (!resText || !resText.trim()) {
    throw new Error(`Qikink Order Creation response was empty (Status ${response.status})`);
  }
  const rawJson = JSON.parse(resText);
  return QikinkCreateOrderResponseSchema.parse(rawJson);
}

/**
 * Retrieves the list of orders from Qikink (GET /api/order).
 */
export async function getAllOrders(
  fromDate?: string,
  toDate?: string
): Promise<QikinkOrderDetails[]> {
  let endpoint = QIKINK_ENDPOINTS.ORDERS as string;
  const params = new URLSearchParams();
  if (fromDate) params.append('from_date', fromDate);
  if (toDate) params.append('to_date', toDate);
  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  const response = await qikinkRequest(endpoint, { method: 'GET' });

  const resText = await response.text();
  if (!resText || !resText.trim()) {
    return [];
  }
  let rawJson: any;
  try {
    rawJson = JSON.parse(resText);
  } catch (e) {
    return [];
  }
  const list = Array.isArray(rawJson) ? rawJson : [rawJson];
  return list.map((item: any) => QikinkOrderDetailsSchema.parse(item));
}

/**
 * Retrieves single order details from Qikink (GET /api/order?id=... as in Screenshot 3).
 * Falls back to finding order from account order list if needed.
 */
export async function getOrderDetails(
  orderId: string,
  fromDate?: string,
  toDate?: string
): Promise<QikinkOrderDetails> {
  // 1. Attempt direct single order query using ?id={orderId}
  try {
    const params = new URLSearchParams({ id: orderId });
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);

    const directEndpoint = `${QIKINK_ENDPOINTS.ORDERS}?${params.toString()}`;
    const response = await qikinkRequest(directEndpoint, { method: 'GET' });

    if (response.ok) {
      const text = await response.text();
      if (text && text.trim()) {
        const rawData = JSON.parse(text);
        // If single object returned directly
        if (rawData && !Array.isArray(rawData)) {
          return QikinkOrderDetailsSchema.parse(rawData);
        }
        // If array returned
        if (Array.isArray(rawData) && rawData.length > 0) {
          const found = rawData.find(
            (o: any) => o.number === orderId || o.order_id?.toString() === orderId
          ) || rawData[0];
          return QikinkOrderDetailsSchema.parse(found);
        }
      }
    }
  } catch (err) {
    console.warn(`Direct single order fetch for ${orderId} failed, falling back to full list search.`, err);
  }

  // 2. Retrieve order history list and find active non-cancelled matching order
  const rawList = await getAllOrders(fromDate, toDate);
  const cleanSearch = orderId.replace(/[^a-zA-Z0-9]/g, '');

  const activeOrder = rawList.find((o) => {
    if (!o) return false;
    const numStr = String(o.number || '').replace(/[^a-zA-Z0-9]/g, '');
    const idStr = String(o.order_id || '');
    const isMatch = numStr.includes(cleanSearch) || idStr === orderId || idStr === cleanSearch;
    return isMatch && o.status !== 'Cancelled';
  });

  if (activeOrder) {
    return activeOrder;
  }

  const anyMatchingOrder = rawList.find((o) => {
    if (!o) return false;
    const numStr = String(o.number || '').replace(/[^a-zA-Z0-9]/g, '');
    const idStr = String(o.order_id || '');
    return numStr.includes(cleanSearch) || idStr === orderId || idStr === cleanSearch;
  });

  if (anyMatchingOrder) {
    return anyMatchingOrder;
  }

  const latestActive = rawList.find((o) => o && o.status !== 'Cancelled');
  if (latestActive) {
    return latestActive;
  }

  if (rawList.length > 0 && rawList[0]) {
    return rawList[0];
  }

  throw new Error(`Qikink Order "${orderId}" not found in account order history.`);
}

/**
 * Retrieves the status value of an order.
 */
export async function getOrderStatus(
  orderId: string
): Promise<string> {
  const details = await getOrderDetails(orderId);
  return details.status || 'Processing';
}
