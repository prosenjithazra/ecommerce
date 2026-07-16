import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read Kliamo Fashion's privacy policy. Learn how we handle your personal data, payment info, uploaded graphics, and cookies securely.",
  alternates: {
    canonical: `${baseUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | Kliamo Fashion",
    description: "Read Kliamo Fashion's privacy policy. Learn how we protect your personal data.",
    url: `${baseUrl}/privacy`,
  }
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
