import { MetadataRoute } from 'next';
import { getApiUrl } from '../components/ApiConfig';
import { baseUrl } from '../components/SeoConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    '/categories',
    '/products',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  let categoryRoutes: MetadataRoute.Sitemap = [];

  // Helper method to slugify name
  const slugify = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  // 2. Fetch products dynamically
  try {
    const productsRes = await fetch(getApiUrl('/products'), { next: { revalidate: 3600 } });
    if (productsRes.ok) {
      const products = await productsRes.json();
      if (Array.isArray(products)) {
        productRoutes = products.map((product: any) => {
          const productSlug = product.slug || slugify(product.name);
          return {
            url: `${baseUrl}/products/${productSlug}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          };
        });
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
          url: `${baseUrl}/products?category=${encodeURIComponent(cat.name)}`,
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
