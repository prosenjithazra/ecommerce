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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kliamo Fashion | Premium Storefront",
    template: "%s | Kliamo Fashion"
  },
  description: "Order custom printed hoodies, premium cotton tees, polo shirts, and accessories with zero minimums. Heavyweight blanks, high-fidelity print quality, and instant delivery tracking.",
  keywords: ["custom t-shirt printing", "custom hoodies", "clothing storefront", "custom polo shirts", "personalized clothing", "Kliamo Fashion"],
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Kliamo Fashion",
    title: "Kliamo Fashion | Premium Storefront",
    description: "Order custom printed apparel with zero minimums. Heavyweight cotton blanks and brilliant direct-to-garment prints.",
    images: [
      {
        url: "/kliamologoNew.png",
        width: 800,
        height: 600,
        alt: "Kliamo Fashion Premium Custom Apparel"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Kliamo Fashion | Premium Storefront",
    description: "Order custom printed apparel with zero minimums. Heavyweight cotton blanks and brilliant direct-to-garment prints.",
    images: ["/kliamologoNew.png"],
    creator: "@kliamofashion"
  },
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
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${baseUrl}/#organization`,
                  "name": "Kliamo Fashion",
                  "url": baseUrl,
                  "logo": `${baseUrl}/kliamologoNew.png`,
                  "email": "support@kliamofashion.com",
                  "sameAs": [
                    "https://twitter.com/kliamofashion",
                    "https://instagram.com/kliamofashion",
                    "https://facebook.com/kliamofashion"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": `${baseUrl}/#website`,
                  "url": baseUrl,
                  "name": "Kliamo Fashion",
                  "description": "Order custom printed hoodies, premium cotton tees, polo shirts, and accessories with zero minimums.",
                  "publisher": {
                    "@id": `${baseUrl}/#organization`
                  },
                  "potentialAction": [
                    {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
                      },
                      "query-input": "required name=search_term_string"
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
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
