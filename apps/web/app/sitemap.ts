import { MetadataRoute } from 'next';
import { getApiUrl } from '../components/ApiConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

  // 1. Define static page routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/refund',
    '/shipping',
    '/terms',
    '/privacy',
    '/coming-soon',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  // 2. Fetch products dynamically (with graceful fallback if backend is offline at build time)
  try {
    const productsRes = await fetch(getApiUrl('/products'), { next: { revalidate: 3600 } });
    if (productsRes.ok) {
      const products = await productsRes.json();
      if (Array.isArray(products)) {
        productRoutes = products.map((product: any) => ({
          url: `${baseUrl}/products/${product.id}`,
          lastModified: new Date(product.updatedAt || new Date()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }
    }
  } catch (error) {
    console.warn('Sitemap generator failed to fetch products from backend, using fallback.', error);
  }

  // 3. Fetch categories dynamically
  try {
    const categoriesRes = await fetch(getApiUrl('/category'), { next: { revalidate: 3600 } });
    if (categoriesRes.ok) {
      const categories = await categoriesRes.json();
      if (Array.isArray(categories)) {
        categoryRoutes = categories.map((cat: any) => ({
          url: `${baseUrl}/categories?id=${cat.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
    console.warn('Sitemap generator failed to fetch categories from backend, using fallback.', error);
  }

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
