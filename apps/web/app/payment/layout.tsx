import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Secure Payment',
  description: 'Complete transaction for your Kliamo Fashion printing order.',
  path: '/payment',
  noIndex: true,
});

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
