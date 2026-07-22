import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'My Profile',
  description: 'Manage your Kliamo Fashion account, addresses, and order history.',
  path: '/profile',
  noIndex: true,
});

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
