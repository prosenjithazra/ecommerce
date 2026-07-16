import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '../../../../lib/qikink/webhook';
import { getApiUrl } from '../../../../components/ApiConfig';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-qikink-signature') || '';
    const rawBody = await request.text();

    // Verify webhook signature (using QIKINK_CLIENT_SECRET)
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: signature verification failed' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    console.log('Qikink webhook event received:', payload);

    // Map Qikink status to local DB order status
    let localStatus = 'Pending';
    const qStatus = (payload.status || '').toLowerCase();
    
    if (qStatus.includes('deliver')) {
      localStatus = 'Delivered';
    } else if (
      qStatus.includes('ship') ||
      qStatus.includes('transit') ||
      qStatus.includes('pickup') ||
      qStatus.includes('delivery')
    ) {
      localStatus = 'Shipped';
    } else if (
      qStatus.includes('production') ||
      qStatus.includes('process') ||
      qStatus.includes('print') ||
      qStatus.includes('ready')
    ) {
      localStatus = 'Processing';
    } else if (qStatus.includes('cancel') || qStatus.includes('refund')) {
      localStatus = 'Cancelled';
    } else if (qStatus.includes('return') || qStatus.includes('rto')) {
      localStatus = 'Returned';
    }

    const orderId = payload.number || payload.order_number;
    if (orderId) {
      // Sync status back to our PostgreSQL database
      const dbUrl = getApiUrl(`/orders/${orderId}`);
      await fetch(dbUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: localStatus,
          trackingNumber: payload.awb || undefined,
          trackingLink: payload.tracking_link || undefined,
          courierName: payload.shipping_type || 'Qikink Partner',
        }),
      }).catch(err => console.error('Failed to sync webhook status to local DB:', err));
    }

    return NextResponse.json({ success: true, processed: true });
  } catch (error: any) {
    console.error('Qikink webhook handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
