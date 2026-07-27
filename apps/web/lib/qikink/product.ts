import { getApiUrl } from '../../components/ApiConfig';

export interface QikinkColor {
  name: string;
  hex: string;
}

export interface QikinkProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  inStock: boolean;
  tag?: string;
  description?: string;
  colors?: QikinkColor[];
  sizes?: string[];
  rating?: number;
  reviewsCount?: number;
  skuMapping?: Record<string, string>;
  qikink_shipping?: number;
  search_from_my_products?: number;
  print_type_id?: number;
}

const COLOR_CODES: Record<string, string> = {
  'white': 'Wh',
  'black': 'Bk',
  'grey': 'Gy',
  'heather grey': 'Gy',
  'navy': 'Ny',
  'navy blue': 'Ny',
  'green': 'Gn',
  'forest green': 'Gn',
  'red': 'Rd',
  'crimson red': 'Rd',
  'blue': 'Bl',
  'royal blue': 'Rbl',
  'yellow': 'Yl',
};

/**
 * Normalizes raw backend product object into Qikink product format
 */
export function normalizeQikinkProduct(item: any): QikinkProductItem {
  const baseSku = item.sku || `QIK-${(item.id || item.slug || item._id || 'prod').toString().slice(-6).toUpperCase()}`;
  const colors = Array.isArray(item.colors) && item.colors.length > 0
    ? item.colors
    : [{ name: 'White', hex: '#ffffff' }];
  const sizes = Array.isArray(item.sizes) && item.sizes.length > 0
    ? item.sizes
    : ['S', 'M', 'L', 'XL'];

  // Auto-generate SKU mapping if missing
  const skuMapping: Record<string, string> = { ...item.skuMapping };
  colors.forEach((colorObj: any) => {
    const cName = typeof colorObj === 'string' ? colorObj : colorObj.name || 'White';
    const cCode = COLOR_CODES[cName.toLowerCase()] || cName.slice(0, 2).toUpperCase();
    sizes.forEach((s: string) => {
      const key = `${cName}_${s}`;
      if (!skuMapping[key]) {
        skuMapping[key] = `${baseSku}-${cCode}-${s}`;
      }
    });
  });

  return {
    id: String(item.id || item._id || item.slug),
    name: item.name || 'Untitled Product',
    slug: item.slug || (item.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: baseSku,
    price: Number(item.price) || 0,
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    category: item.category || 'T-Shirts',
    image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
    images: Array.isArray(item.images) ? item.images : [item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500'],
    inStock: item.inStock !== false,
    tag: item.tag || '',
    description: item.description || '',
    colors,
    sizes,
    rating: item.rating ? Number(item.rating) : 5.0,
    reviewsCount: item.reviewsCount ? Number(item.reviewsCount) : 0,
    skuMapping,
    qikink_shipping: 1,
    search_from_my_products: 1,
    print_type_id: 1,
  };
}

/**
 * Fetches all dynamic products directly from the database API.
 */
export async function fetchAllProducts(): Promise<QikinkProductItem[]> {
  try {
    const res = await fetch(getApiUrl('/products'), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data.map(normalizeQikinkProduct);
      }
    }
  } catch (err) {
    console.error('Backend API /products fetch error:', err);
  }
  return [];
}

/**
 * Fetches single product details dynamically by ID, slug, or SKU.
 */
export async function fetchProductById(idOrSlugOrSku: string): Promise<QikinkProductItem> {
  const queryTerm = idOrSlugOrSku.toLowerCase().trim();
  try {
    const res = await fetch(getApiUrl(`/products/${encodeURIComponent(idOrSlugOrSku)}`), {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.id || data.slug || data._id)) {
        return normalizeQikinkProduct(data);
      }
    }
  } catch (err) {
    console.warn(`Direct fetch for product ${idOrSlugOrSku} failed, searching dynamic catalog.`, err);
  }

  const all = await fetchAllProducts();
  const found = all.find(
    (p) =>
      p.id.toLowerCase() === queryTerm ||
      p.slug.toLowerCase() === queryTerm ||
      p.sku.toLowerCase() === queryTerm ||
      Object.values(p.skuMapping || {}).some((s) => s.toLowerCase() === queryTerm)
  );

  if (!found) {
    throw new Error(`Product "${idOrSlugOrSku}" not found in database.`);
  }

  return found;
}

/**
 * Generates and returns variant matrix for a given product ID or slug.
 */
export async function fetchProductVariants(productId: string): Promise<Array<{
  color: string;
  size: string;
  sku: string;
  inStock: boolean;
  price: number;
}>> {
  const product = await fetchProductById(productId);
  const variants: Array<{
    color: string;
    size: string;
    sku: string;
    inStock: boolean;
    price: number;
  }> = [];

  const colors = product.colors || [{ name: 'White', hex: '#ffffff' }];
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  colors.forEach((c) => {
    const cName = typeof c === 'string' ? c : c.name;
    sizes.forEach((s) => {
      const key = `${cName}_${s}`;
      const mappedSku = product.skuMapping?.[key] || `${product.sku}-${COLOR_CODES[cName.toLowerCase()] || 'XX'}-${s}`;
      variants.push({
        color: cName,
        size: s,
        sku: mappedSku,
        inStock: product.inStock,
        price: product.price,
      });
    });
  });

  return variants;
}

/**
 * Returns available product categories dynamically.
 */
export async function fetchCategories(): Promise<string[]> {
  const products = await fetchAllProducts();
  const categoriesSet = new Set(products.map((p) => p.category));
  return Array.from(categoriesSet);
}

/**
 * Searches dynamic products by search query.
 */
export async function searchProducts(query: string): Promise<QikinkProductItem[]> {
  const term = query.toLowerCase().trim();
  const products = await fetchAllProducts();
  if (!term) return products;

  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
  );
}

/**
 * Creates / Adds a new dynamic product in backend database.
 */
export async function createQikinkProduct(data: Partial<QikinkProductItem>): Promise<QikinkProductItem> {
  try {
    const res = await fetch(getApiUrl('/products'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const created = await res.json();
      return normalizeQikinkProduct(created);
    }
  } catch (err) {
    console.error('Backend DB post error:', err);
  }

  return normalizeQikinkProduct(data);
}
