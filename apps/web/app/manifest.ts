import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kliamo Fashion',
    short_name: 'Kliamo',
    description: 'Order custom printed hoodies, premium cotton tees, polo shirts, and accessories with zero minimums.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FDFAF6',
    theme_color: '#F9A37E',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
