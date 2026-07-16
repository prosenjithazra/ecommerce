import { Metadata } from 'next';
import { getApiUrl } from '../../../components/ApiConfig';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
  
  try {
    const res = await fetch(getApiUrl(`/products/${id}`));
    if (res.ok) {
      const product = await res.json();
      return {
        title: product.name,
        description: product.description || `Order ${product.name} on Kliamo Fashion. Premium print quality with zero minimums.`,
        alternates: {
          canonical: `${baseUrl}/products/${id}`,
        },
        openGraph: {
          title: `${product.name} | Kliamo Fashion`,
          description: product.description || `Order ${product.name} on Kliamo Fashion.`,
          url: `${baseUrl}/products/${id}`,
          images: [
            {
              url: product.image,
              alt: product.name,
            },
          ],
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
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
  let product: any = null;

  try {
    const res = await fetch(getApiUrl(`/products/${id}`));
    if (res.ok) {
      product = await res.json();
    }
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
              "@id": `${baseUrl}/products/${id}#product`,
              "name": product.name,
              "image": product.image,
              "description": product.description || `Order ${product.name} on Kliamo Fashion.`,
              "sku": product.id || id,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "INR",
                "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "url": `${baseUrl}/products/${id}`
              }
            })
          }}
        />
      )}
      {children}
    </>
  );
}
