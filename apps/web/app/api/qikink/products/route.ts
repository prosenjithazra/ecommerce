import { NextResponse } from 'next/server';
import { fetchAllProducts } from '../../../../lib/qikink/product';

export async function GET() {
  try {
    await fetchAllProducts();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Not Supported', 
        message: error.message || 'Operation not supported by Qikink API' 
      },
      { status: 501 }
    );
  }
}
