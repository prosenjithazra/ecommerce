import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "My Account Dashboard",
  robots: {
    index: false,
    follow: false,
  }
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
