import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Coming Soon - Launching 1st August",
  description: "Our premium custom apparel storefront is launching on 1st August. Subscribe to receive launch updates and 15% discount codes.",
  alternates: {
    canonical: `${baseUrl}/coming-soon`,
  },
  openGraph: {
    title: "Coming Soon | Kliamo Fashion",
    description: "Our premium custom apparel storefront is launching on 1st August.",
    url: `${baseUrl}/coming-soon`,
  }
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
