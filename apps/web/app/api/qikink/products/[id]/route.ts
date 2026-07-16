import { NextResponse } from 'next/server';
import { fetchProductById } from '../../../../../lib/qikink/product';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await fetchProductById(resolvedParams.id);
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
