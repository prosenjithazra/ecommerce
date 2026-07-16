import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Shop Premium Blanks Catalog",
  description: "Browse our extensive catalog of premium cotton t-shirts, hoodies, and accessories. Zero minimums for custom DTG printing.",
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title: "Shop Premium Blanks | Kliamo Fashion",
    description: "Browse our catalog of premium cotton t-shirts, hoodies, and accessories.",
    url: `${baseUrl}/products`,
  }
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  // Inject CollectionPage Schema (JSON-LD)
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
      "logo": `${baseUrl}/kliamologoNew.png`
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {children}
    </>
  );
}
