import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/dashboard', '/api', '/private', '/wishlist', '/cart', '/checkout', '/profile'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
