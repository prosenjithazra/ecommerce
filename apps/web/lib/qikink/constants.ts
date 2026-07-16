export const QIKINK_ENDPOINTS = {
  TOKEN: '/api/token',
  CREATE_ORDER: '/api/order/create',
  ORDERS: '/api/order',
} as const;

export const QIKINK_HEADERS = {
  CLIENT_ID: 'ClientId',
  ACCESS_TOKEN: 'Accesstoken',
} as const;

export const QIKINK_ERRORS = {
  UNAUTHORIZED: 'Qikink authorization failed.',
  BAD_REQUEST: 'Invalid request data sent to Qikink.',
  RATE_LIMIT: 'Qikink API rate limit exceeded.',
  NOT_FOUND: 'Qikink resource not found.',
  UNSUPPORTED: 'This operation is not supported by the Qikink Custom API.',
} as const;
