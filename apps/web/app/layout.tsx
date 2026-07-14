import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "../components/AppContext";
import { LayoutWrapper } from "../components/LayoutWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Kaiva Fashion - Premium Print-on-Demand Storefront",
  description: "Create and order premium custom-designed apparel, hoodies, and accessories instantly.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <AppProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
