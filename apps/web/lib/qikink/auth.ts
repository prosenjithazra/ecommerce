import { QikinkTokenResponseSchema } from './types';
import { QIKINK_ENDPOINTS } from './constants';

interface CachedQikinkToken {
  accessToken: string;
  expiresAt: number;
}

const globalForQikinkToken = global as unknown as {
  qikinkCachedToken?: CachedQikinkToken;
};

/**
 * Retrieves the cached Qikink access token, or fetches a new one if expired/missing.
 * Prevents multiple token requests by keeping a single active session token in global state.
 */
export async function getAccessToken(forceRefresh = false): Promise<string> {
  const clientId = process.env.QIKINK_CLIENT_ID;
  const clientSecret = process.env.QIKINK_CLIENT_SECRET;
  const baseUrl = process.env.QIKINK_API_URL || process.env.QIKINK_SANDBOX_BASE_URL || 'https://api.qikink.com';

  if (!clientId || !clientSecret) {
    throw new Error('Missing Qikink API Credentials (QIKINK_CLIENT_ID or QIKINK_CLIENT_SECRET) in .env.local');
  }

  if (forceRefresh) {
    globalForQikinkToken.qikinkCachedToken = undefined;
  }

  const now = Date.now();
  // Return cached token if valid (with 60 seconds buffer)
  if (
    !forceRefresh &&
    globalForQikinkToken.qikinkCachedToken &&
    globalForQikinkToken.qikinkCachedToken.expiresAt > now + 60 * 1000
  ) {
    return globalForQikinkToken.qikinkCachedToken.accessToken;
  }

  console.log('Qikink access token expired or missing. Fetching a fresh token...');

  const tokenUrl = `${baseUrl}${QIKINK_ENDPOINTS.TOKEN}`;
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      ClientId: clientId,
      client_secret: clientSecret,
    }),
  });

  const resText = await response.text();
  if (!resText || !resText.trim()) {
    throw new Error(`Qikink Token response was empty (Status ${response.status})`);
  }
  let rawJson: any;
  try {
    rawJson = JSON.parse(resText);
  } catch (err) {
    throw new Error(`Invalid JSON from Qikink Token endpoint: ${resText.slice(0, 100)}`);
  }
  const parsed = QikinkTokenResponseSchema.parse(rawJson);

  // Store token in global caching
  globalForQikinkToken.qikinkCachedToken = {
    accessToken: parsed.Accesstoken,
    expiresAt: now + parsed.expires_in * 1000,
  };

  return parsed.Accesstoken;
}

/**
 * Forces clearance of token cache and requests a new token.
 */
export async function forceRefreshAccessToken(): Promise<string> {
  globalForQikinkToken.qikinkCachedToken = undefined;
  return getAccessToken();
}
