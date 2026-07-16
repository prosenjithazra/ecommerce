import { getAccessToken } from './auth';
import { QIKINK_HEADERS } from './constants';

/**
 * Base request client for Qikink Custom API.
 * Automatically injects authorization headers, resolves baseUrl, and handles retries.
 */
export async function qikinkRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const clientId = process.env.QIKINK_CLIENT_ID;
  const baseUrl = process.env.QIKINK_SANDBOX_BASE_URL || process.env.QIKINK_API_URL || 'https://sandbox.qikink.com';

  if (!clientId) {
    throw new Error('Missing QIKINK_CLIENT_ID in environment variables.');
  }

  // Get active token (handles expiration and caching automatically)
  const token = await getAccessToken();

  const url = `${baseUrl}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    [QIKINK_HEADERS.CLIENT_ID]: clientId,
    [QIKINK_HEADERS.ACCESS_TOKEN]: token,
  };

  let attempt = 0;
  const maxRetries = 3;
  const backoffMs = 1000;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, { ...options, headers });
      
      // Auto-retry on rate limits (429) and server errors (5xx)
      if (response.status >= 500 || response.status === 429) {
        throw new Error(`HTTP Status Error: ${response.status}`);
      }

      return response;
    } catch (error) {
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }
      const delay = backoffMs * Math.pow(2, attempt);
      console.warn(`Qikink request failed, retrying in ${delay}ms... (Attempt ${attempt}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Qikink request failed after maximum retries');
}
