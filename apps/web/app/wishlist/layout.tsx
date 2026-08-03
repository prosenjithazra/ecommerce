import { Metadata } from 'next';
import { getMetadata } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'My Wishlist',
  description: 'Your saved designs and premium blanks on Kliamo Fashion.',
  path: '/wishlist',
  noIndex: true,
});

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
