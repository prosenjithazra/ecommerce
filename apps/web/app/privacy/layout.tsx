import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Privacy Policy',
  description: "Read Kliamo Fashion's privacy policy. Learn how we handle your personal data, payment info, uploaded graphics, and cookies securely.",
  path: '/privacy',
});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy' },
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
