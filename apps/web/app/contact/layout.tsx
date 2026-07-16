import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Kliamo Fashion's customer support. We are here to answer questions about orders, designs, and shipping.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "Contact Us | Kliamo Fashion",
    description: "Get in touch with Kliamo Fashion's customer support.",
    url: `${baseUrl}/contact`,
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
