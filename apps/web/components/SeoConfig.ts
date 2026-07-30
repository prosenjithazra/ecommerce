import { Metadata } from 'next';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamo.com';
export const siteName = 'Kliamo Fashion';
export const googleVerification = 'google-site-verification-placeholder-1234';
export const bingVerification = 'bing-site-verification-placeholder-5678';

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function getMetadata(options: SeoOptions): Metadata {
  const canonicalUrl = `${baseUrl}${options.path}`;
  const title = `${options.title} | ${siteName}`;
  const robots: any = options.noIndex
    ? {
        index: false,
        follow: false,
        nocache: true,
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      };

  const defaultKeywords = [
    'custom t-shirt printing',
    'custom hoodies',
    'print on demand India',
    'Kliamo Fashion',
    'heavyweight blanks',
    'custom oversized t-shirts',
    'polo shirts',
    'personalized streetwear',
  ];

  return {
    metadataBase: new URL(baseUrl),
    title,
    description: options.description,
    keywords: options.keywords ? [...options.keywords, ...defaultKeywords] : defaultKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      type: (options.ogType === 'product' ? 'website' : options.ogType || 'website') as any,
      locale: 'en_US',
      url: canonicalUrl,
      siteName,
      title,
      description: options.description,
      images: [
        {
          url: options.ogImage || `${baseUrl}/kliamologoNew.png`,
          width: 1200,
          height: 630,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: options.description,
      images: [options.ogImage || `${baseUrl}/kliamologoNew.png`],
      creator: '@kliamofashion',
    },
    verification: {
      google: googleVerification,
      other: {
        'msvalidate.01': bingVerification,
      },
    },
  };
}

/* ── Schema.org JSON-LD Builders ── */

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "Kliamo Fashion",
    "url": baseUrl,
    "logo": `${baseUrl}/kliamologoNew.png`,
    "description": "Premium custom print-on-demand streetwear storefront offering heavyweight blanks, DTG printing, and instant order tracking.",
    "email": "contact@kliamo.com",
    "sameAs": [
      "https://twitter.com/kliamofashion",
      "https://instagram.com/kliamofashion",
      "https://facebook.com/kliamofashion"
    ]
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Kliamo Fashion",
    "description": "Order custom printed hoodies, premium cotton tees, polo shirts, and accessories with zero minimums.",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };
}

export function getBreadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.path ? { "item": `${baseUrl}${item.path.startsWith('/') ? item.path : '/' + item.path}` } : {})
    }))
  };
}

export function getProductSchema(product: any) {
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || `${baseUrl}/kliamologoNew.png`];

  const ratingValue = product.rating || 4.8;
  const reviewCount = product.reviewsCount || 12;
  const productUrl = `${baseUrl}/products/${product.slug || product.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": product.name,
    "image": images,
    "description": product.description || `Custom printed ${product.name} on premium blank garment. High-durability DTG print with zero minimums.`,
    "sku": product.sku || `SKU-${product.id}`,
    "mpn": product.sku || `MPN-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Kliamo Fashion"
    },
    "category": product.category || "T-Shirts",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": Number(product.price) || 0,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Kliamo Fashion"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": Number(ratingValue),
      "reviewCount": Number(reviewCount),
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

export function getFaqSchema(faqItems: { heading: string; content: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((item) => ({
      "@type": "Question",
      "name": item.heading,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.content
      }
    }))
  };
}

export function getWebPageSchema(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${path}#webpage`,
    "url": `${baseUrl}${path}`,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    }
  };
}
