import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Refund & Returns Policy',
  description: "Read Kliamo Fashion's return & refund policy. Learn how we handle custom print errors, exchange policies, shipping defects, and timelines.",
  path: '/refund',
});

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Refund Policy', path: '/refund' },
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
