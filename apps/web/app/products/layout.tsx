import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema, baseUrl } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Shop Premium Blanks Catalog',
  description: 'Browse our extensive catalog of premium cotton t-shirts, hoodies, and accessories. Zero minimums for custom DTG printing.',
  path: '/products',
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/products#collection`,
    "name": "Kliamo Fashion Blank Apparel Collection",
    "description": "High-quality heavy cotton blanks ready for custom DTG printing, including t-shirts, hoodies, and polo shirts.",
    "url": `${baseUrl}/products`,
    "publisher": {
      "@type": "Organization",
      "name": "Kliamo Fashion",
      "logo": `${baseUrl}/kliamoLogo.png`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
