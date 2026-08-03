import { NextResponse } from 'next/server';
import { createOrder, getOrderDetails, getAllOrders } from '../../../../lib/qikink/order';
import { QikinkCreateOrderInputSchema } from '../../../../lib/qikink/types';
import { ZodError } from 'zod';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId') || searchParams.get('id');
    const fromDate = searchParams.get('from_date') || undefined;
    const toDate = searchParams.get('to_date') || undefined;

    if (orderId) {
      try {
        const details = await getOrderDetails(orderId, fromDate, toDate);
        return NextResponse.json({
          success: true,
          order: details,
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          order: null,
          message: err.message || `Order "${orderId}" not found in Qikink account history.`,
        });
      }
    }

    const ordersList = await getAllOrders(fromDate, toDate);
    return NextResponse.json({
      success: true,
      orders: ordersList,
      count: ordersList.length,
    });
  } catch (error: any) {
    console.error('Qikink Orders Route GET Error:', error);
    return NextResponse.json({
      success: false,
      orders: [],
      error: error.message || 'Failed to retrieve orders from Qikink API',
    });
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
