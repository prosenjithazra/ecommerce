import { Metadata } from 'next';

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
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

  return {
    metadataBase: new URL(baseUrl),
    title,
    description: options.description,
    keywords: options.keywords || [
      'custom t-shirt printing',
      'custom hoodies',
      'clothing storefront',
      'custom polo shirts',
      'personalized clothing',
      'Kliamo Fashion',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots,
    openGraph: {
      type: (options.ogType || 'website') as any,
      locale: 'en_US',
      url: canonicalUrl,
      siteName,
      title,
      description: options.description,
      images: [
        {
          url: options.ogImage || `${baseUrl}/kliamoLogo.png`,
          width: 800,
          height: 600,
          alt: options.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: options.description,
      images: [options.ogImage || `${baseUrl}/kliamoLogo.png`],
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

export function getBreadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.path ? { "item": `${baseUrl}${item.path}` } : {})
    }))
  };
}
