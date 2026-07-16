import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Shop by Category",
  description: "Explore our curated clothing categories including heavyweight hoodies, classic tees, and sports polo shirts designed for printing customization.",
  alternates: {
    canonical: `${baseUrl}/categories`,
  },
  openGraph: {
    title: "Categories | Kliamo Fashion",
    description: "Explore our clothing categories including heavyweight hoodies, classic tees, and sports polo shirts.",
    url: `${baseUrl}/categories`,
  }
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
