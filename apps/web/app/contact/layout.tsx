import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Contact Us',
  description: "Get in touch with Kliamo Fashion's customer support. We are here to answer questions about orders, designs, and shipping.",
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact Us', path: '/contact' },
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
