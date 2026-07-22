import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'About Us',
  description: "Learn about Kliamo Fashion's story, craftsmanship, and dedication to high-quality blanks and custom clothing.",
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
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
