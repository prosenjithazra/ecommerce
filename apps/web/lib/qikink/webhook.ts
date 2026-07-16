import crypto from 'crypto';

/**
 * NOTE: Qikink webhooks are NOT supported for programmatic creation/management via the API. 
 * To receive webhook events, you must manually log in to the Qikink Seller Dashboard, 
 * go to your settings, and register your public endpoint URL:
 * https://your-domain.com/api/qikink/webhook
 * 
 * Below we implement incoming signature verification to authenticate webhook requests.
 */

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const secret = process.env.QIKINK_CLIENT_SECRET;
  if (!signature || !secret) return false;

  try {
    const computed = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(computed, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (error) {
    console.error('Qikink Webhook signature verification error:', error);
    return false;
  }
}
