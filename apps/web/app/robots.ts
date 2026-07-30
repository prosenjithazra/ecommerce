import { MetadataRoute } from 'next';
import { baseUrl } from '../components/SeoConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/profile',
          '/orders',
          '/wishlist',
          '/notifications',
          '/payment',
          '/verify-otp',
          '/reset-password',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'AnthropicBot'],
        allow: [
          '/',
          '/products',
          '/products/*',
          '/categories',
          '/about',
          '/contact',
          '/faq',
          '/refund',
          '/shipping',
          '/terms',
          '/privacy',
          '/custom',
        ],
        disallow: ['/admin/*', '/cart', '/checkout', '/profile', '/orders'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
