import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "Read Kliamo Fashion's refund and cancellation policies. Returns accepted for print errors or damaged blanks within 30 days of delivery.",
  alternates: {
    canonical: `${baseUrl}/refund`,
  },
  openGraph: {
    title: "Refund & Cancellation | Kliamo Fashion",
    description: "Read Kliamo Fashion's refund and cancellation policies.",
    url: `${baseUrl}/refund`,
  }
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
