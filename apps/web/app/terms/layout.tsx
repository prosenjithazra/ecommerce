import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read Kliamo Fashion's terms of service. Understand intellectual property ownership, design submission rules, and general checkout usage policies.",
  alternates: {
    canonical: `${baseUrl}/terms`,
  },
  openGraph: {
    title: "Terms & Conditions | Kliamo Fashion",
    description: "Read Kliamo Fashion's terms of service.",
    url: `${baseUrl}/terms`,
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
