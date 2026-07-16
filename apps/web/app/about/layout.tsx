import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Kliamo Fashion's story, craftsmanship, and dedication to high-quality blanks and custom clothing.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Us | Kliamo Fashion",
    description: "Learn about Kliamo Fashion's story, craftsmanship, and dedication to high-quality blanks and custom clothing.",
    url: `${baseUrl}/about`,
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
