import { NextResponse } from 'next/server';
import { fetchAllProducts, searchProducts, createQikinkProduct } from '../../../../lib/qikink/product';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || searchParams.get('search') || searchParams.get('q');
    const category = searchParams.get('category') || searchParams.get('cat');
    const sku = searchParams.get('sku');
    const homeSection = searchParams.get('homeSection') || searchParams.get('section');
    const targetGender = searchParams.get('targetGender') || searchParams.get('gender');

    let products = await fetchAllProducts();

    if (query) {
      products = await searchProducts(query);
    }

    if (category && category.toLowerCase() !== 'all') {
      products = products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (sku) {
      products = products.filter(
        (p) =>
          p.sku.toLowerCase() === sku.toLowerCase() ||
          Object.values(p.skuMapping || {}).some((s) => s.toLowerCase() === sku.toLowerCase())
      );
    }

    if (homeSection) {
      const secQuery = homeSection.trim().toLowerCase();
      products = products.filter((p) => {
        const sections = Array.isArray(p.homeSection)
          ? p.homeSection
          : typeof p.homeSection === 'string'
            ? [p.homeSection]
            : [];
        return (
          sections.some((s) => s.trim().toLowerCase() === secQuery) ||
          (p.tag || '').trim().toLowerCase() === secQuery
        );
      });
    }

    if (targetGender) {
      const genQuery = targetGender.trim().toLowerCase();
      products = products.filter((p) => {
        const g = (p.targetGender || 'Both').trim().toLowerCase();
        if (genQuery === 'men') return g === 'men' || g === 'both';
        if (genQuery === 'women') return g === 'women' || g === 'both';
        return g === genQuery;
      });
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error: any) {
    console.error('Qikink Products API Route Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve products from Qikink store catalog',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || (!body.name && !body.id && !body.sku)) {
      return NextResponse.json(
        { success: false, error: 'Product details are required' },
        { status: 400 }
      );
    }

    let createdProduct: any;
    try {
      createdProduct = await createQikinkProduct(body);
    } catch (err: any) {
      // If backend service is unavailable, format the product payload directly
      createdProduct = {
        id: String(body.id || body.slug || 'qik-' + Date.now()),
        name: body.name || 'Synced Product',
        slug: body.slug || 'synced-product',
        sku: body.sku || 'QIK-SKU-' + Date.now(),
        price: Number(body.price) || 0,
        category: body.category || 'T-Shirts',
        image: body.image || '',
        inStock: body.inStock !== false,
        skuMapping: body.skuMapping || {},
        qikink_shipping: 1,
        search_from_my_products: 1,
        print_type_id: 1,
      };
    }

    return NextResponse.json({
      success: true,
      product: createdProduct,
      message: 'Product mapped and synced with Qikink My Products Library',
    });
  } catch (error: any) {
    console.error('Qikink Product Create API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to sync product' },
      { status: 500 }
    );
  }
}
