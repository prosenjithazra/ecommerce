import { Metadata } from 'next';
import { getApiUrl } from '../../../components/ApiConfig';
import { getMetadata, getBreadcrumbSchema, baseUrl } from '../../../components/SeoConfig';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(getApiUrl(`/products/slug/${slug}`));
    if (res.ok) {
      const product = await res.json();
      return getMetadata({
        title: product.name,
        description: product.description || `Order ${product.name} on Kliamo Fashion. Premium print quality with zero minimums.`,
        path: `/products/${slug}`,
        ogType: 'product',
        ogImage: product.image,
        keywords: [product.name, product.category, 'custom printed apparel', 'Kliamo Fashion'],
      });
    }
  } catch (error) {
    console.error('Failed to generate product metadata:', error);
  }

  return getMetadata({
    title: 'Product Details',
    description: 'Browse our premium customizable blanks catalog.',
    path: `/products/${slug}`,
  });
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  let product: any = null;

  try {
    const res = await fetch(getApiUrl(`/products/slug/${slug}`));
    if (res.ok) product = await res.json();
  } catch (error) {
    console.error('Failed to fetch product data for layout JSON-LD:', error);
  }

  const breadcrumbSchema = product
    ? getBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: product.name, path: `/products/${slug}` },
      ])
    : null;

  const productSchema = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${baseUrl}/products/${slug}#product`,
        "name": product.name,
        "image": product.image,
        "description": product.description || `Order ${product.name} on Kliamo Fashion.`,
        "sku": product.sku || product.id || slug,
        "brand": {
          "@type": "Brand",
          "name": "Kliamo Fashion"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "INR",
          "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": `${baseUrl}/products/${slug}`,
          "priceValidUntil": "2030-12-31"
        }
      }
    : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {children}
    </>
  );
}
