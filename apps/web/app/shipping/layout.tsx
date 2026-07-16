import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: "Read Kliamo Fashion's shipping details. Standard shipping and production processing times for print-on-demand custom clothing orders.",
  alternates: {
    canonical: `${baseUrl}/shipping`,
  },
  openGraph: {
    title: "Shipping & Delivery | Kliamo Fashion",
    description: "Read Kliamo Fashion's shipping details.",
    url: `${baseUrl}/shipping`,
  }
};

export default function ShippingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
