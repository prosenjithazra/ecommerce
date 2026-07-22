import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'My Orders',
  description: 'Track and view status of your customized printing orders.',
  path: '/orders',
  noIndex: true,
});

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
