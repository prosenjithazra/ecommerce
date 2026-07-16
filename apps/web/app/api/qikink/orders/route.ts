import { NextResponse } from 'next/server';
import { createOrder, getOrderDetails } from '../../../../lib/qikink/order';
import { QikinkCreateOrderInputSchema } from '../../../../lib/qikink/types';
import { ZodError } from 'zod';

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

    const details = await getOrderDetails(orderId);
    return NextResponse.json({
      success: true,
      order: details,
    });
  } catch (error: any) {
    console.error('Qikink Order Details Route GET Error:', error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve order details' },
      { status: statusCode }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request schema using Zod
    const validatedData = QikinkCreateOrderInputSchema.parse(body);

    const result = await createOrder(validatedData);

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: result.order_id,
      message: result.message || 'Order successfully submitted to Qikink',
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation Error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Qikink Order Creation Route POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
