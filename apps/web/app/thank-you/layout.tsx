import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Order Completed',
  description: 'Thank you for your order! Your customizable print design is in production.',
  path: '/thank-you',
  noIndex: true,
});

export default function ThankYouLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
