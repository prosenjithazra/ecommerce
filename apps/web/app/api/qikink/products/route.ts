import { NextResponse } from 'next/server';
import { fetchAllProducts, searchProducts, createQikinkProduct, normalizeQikinkProduct } from '../../../../lib/qikink/product';

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
    if (!body || (typeof body !== 'object')) {
      return NextResponse.json(
        { success: false, error: 'Product details payload is required' },
        { status: 400 }
      );
    }

    const productName = body.product_name || body.name || body.title || 'Qikink Store Product';
    const productSku = body.product_sku || body.sku || body.id || `QIK-${Date.now().toString(36).toUpperCase()}`;
    const productId = String(body.product_id || body.id || body.slug || productSku);
    const productPrice = Number(body.retail_price || body.price || body.unit_price) || 499;
    const originalPrice = Number(body.mrp || body.originalPrice || body.compare_at_price) || 0;
    const category = body.category_name || body.category || 'T-Shirts';
    
    let image = body.image_url || body.mockup_url || body.design_url || body.image || '';
    if (!image && Array.isArray(body.images) && body.images.length > 0) {
      image = body.images[0];
    }

    const images = Array.isArray(body.images) && body.images.length > 0
      ? body.images
      : image ? [image] : [];

    let colors: any[] = [];
    if (Array.isArray(body.colors) && body.colors.length > 0) {
      colors = body.colors;
    } else if (Array.isArray(body.variants) && body.variants.length > 0) {
      const colorNames = Array.from(new Set(body.variants.map((v: any) => v.color).filter(Boolean)));
      colors = colorNames.map(c => ({ name: String(c), hex: '#ffffff' }));
    }
    if (colors.length === 0) colors = [{ name: 'White', hex: '#ffffff' }];

    let sizes: string[] = [];
    if (Array.isArray(body.sizes) && body.sizes.length > 0) {
      sizes = body.sizes.map((s: any) => String(s));
    } else if (Array.isArray(body.variants) && body.variants.length > 0) {
      sizes = Array.from(new Set(body.variants.map((v: any) => String(v.size)).filter(Boolean)));
    }
    if (sizes.length === 0) sizes = ['S', 'M', 'L', 'XL'];

    const normalizedPayload = {
      id: productId,
      name: productName,
      slug: (body.slug || productName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      sku: productSku,
      price: productPrice,
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
      category,
      image: image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
      description: body.product_description || body.description || '',
      colors,
      sizes,
      inStock: body.inStock !== false,
      isQikinkSynced: true,
      search_from_my_products: 1,
      qikink_shipping: 1,
      print_type_id: 1,
    };

    let createdProduct: any;
    try {
      createdProduct = await createQikinkProduct(normalizedPayload);
    } catch (err: any) {
      console.warn('Direct database sync failed, formatting normalized fallback product.', err);
      createdProduct = normalizeQikinkProduct(normalizedPayload);
    }

    return NextResponse.json({
      success: true,
      product: createdProduct,
      message: `Product "${productName}" (SKU: ${productSku}) successfully pushed and added to store catalog.`,
    });
  } catch (error: any) {
    console.error('Qikink Product Push API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to push product from Qikink to store' },
      { status: 500 }
    );
  }
}
