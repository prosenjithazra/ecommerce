import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Custom Studio - Design Your Own Apparel',
  description: 'Use our 3D custom studio to design personalized T-shirts, hoodies, and polo shirts with instant high-resolution printing.',
  path: '/custom',
  keywords: ['custom t-shirt designer', '3d garment customizer', 'design your own hoodie', 'custom dtg print studio'],
});

export default function CustomLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Custom Studio', path: '/custom' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
