import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Shipping Policy',
  description: "Read Kliamo Fashion's shipping policy. Learn about our custom print-on-demand fulfillment times, domestic and international shipping rates, and delivery times.",
  path: '/shipping',
});

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Shipping Policy', path: '/shipping' },
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
