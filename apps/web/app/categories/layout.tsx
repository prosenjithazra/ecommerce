import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema, baseUrl } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Shop by Category',
  description: 'Explore our curated clothing categories including heavyweight hoodies, classic tees, and sports polo shirts designed for printing customization.',
  path: '/categories',
});

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}/categories#collection`,
    "name": "Kliamo Fashion Categories",
    "description": "Premium printable blanks categorized for direct-to-garment (DTG) customization.",
    "url": `${baseUrl}/categories`,
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
