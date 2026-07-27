import { NextResponse } from 'next/server';
import { fetchAllProducts, createQikinkProduct } from '../../../../../lib/qikink/product';

export async function POST() {
  try {
    const qikinkProducts = await fetchAllProducts();
    let syncedCount = 0;

    for (const prod of qikinkProducts) {
      try {
        await createQikinkProduct(prod);
        syncedCount++;
      } catch (e) {
        console.warn(`Failed to sync individual product ${prod.name}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      count: syncedCount,
      totalAvailable: qikinkProducts.length,
      products: qikinkProducts,
      message: `Successfully synced ${syncedCount} Qikink products to your store database.`,
    });
  } catch (error: any) {
    console.error('Qikink Products Sync Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync Qikink products to store' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
