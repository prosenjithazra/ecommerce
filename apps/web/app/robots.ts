import { MetadataRoute } from 'next';
import { baseUrl } from '../components/SeoConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/dashboard',
        '/api',
        '/private',
        '/wishlist',
        '/cart',
        '/checkout',
        '/profile',
        '/orders',
        '/notifications',
        '/search',
        '/payment',
        '/thank-you'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
