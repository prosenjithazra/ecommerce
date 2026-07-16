import { NextResponse } from 'next/server';
import { getOrderStatus } from '../../../../lib/qikink/order';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Query parameter orderId is required' },
        { status: 400 }
      );
    }

    const status = await getOrderStatus(orderId);
    return NextResponse.json({
      success: true,
      orderId,
      status,
    });
  } catch (error: any) {
    console.error('Qikink Order Status Route GET Error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve order status' },
      { status: statusCode }
    );
  }
}
