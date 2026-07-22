import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'My Notifications',
  description: 'View updates on order processing, print production status, and shipments.',
  path: '/notifications',
  noIndex: true,
});

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
