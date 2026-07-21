import { Metadata } from 'next';
import { getApiUrl } from '../../../components/ApiConfig';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
  
  try {
    const res = await fetch(getApiUrl(`/products/slug/${slug}`));
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.name,
        description: product.description || `Order ${product.name} on Kliamo Fashion. Premium print quality with zero minimums.`,
        alternates: {
          canonical: `${baseUrl}/products/${slug}`,
        },
        openGraph: {
          title: `${product.name} | Kliamo Fashion`,
          description: product.description || `Order ${product.name} on Kliamo Fashion.`,
          url: `${baseUrl}/products/${slug}`,
          images: [{ url: product.image, alt: product.name }],
        },
        twitter: {
          card: 'summary_large_image',
          title: `${product.name} | Kliamo Fashion`,
          description: product.description || `Order ${product.name} on Kliamo Fashion.`,
          images: [product.image],
        },
      };
    }
  } catch (error) {
    console.error('Failed to generate product metadata:', error);
  }

  return {
    title: 'Product Details | Kliamo Fashion',
    description: 'Browse our premium customizable blanks catalog.',
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
  let product: any = null;

  try {
    const res = await fetch(getApiUrl(`/products/slug/${slug}`));
    if (res.ok) product = await res.json();
  } catch (error) {
    console.error('Failed to fetch product data for layout JSON-LD:', error);
  }

  return (
    <>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "@id": `${baseUrl}/products/${slug}#product`,
              "name": product.name,
              "image": product.image,
              "description": product.description || `Order ${product.name} on Kliamo Fashion.`,
              "sku": product.sku || product.id || slug,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "INR",
                "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": `${baseUrl}/products/${slug}`
              }
            })
          }}
        />
      )}
      {children}
    </>
  );
}
