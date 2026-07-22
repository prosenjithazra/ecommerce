import { Elms_Sans, Kaushan_Script } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../components/AppContext";
import { LayoutWrapper } from "../components/LayoutWrapper";
import { getMetadata, baseUrl } from "../components/SeoConfig";

const elmsSans = Elms_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-elms-sans",
  display: "swap",
});

const kaushanScript = Kaushan_Script({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kaushan-script",
  display: "swap",
});

export const metadata = getMetadata({
  title: 'Premium Storefront',
  description: 'Order custom printed hoodies, premium cotton tees, polo shirts, and accessories with zero minimums. Heavyweight blanks, high-fidelity print quality, and instant delivery tracking.',
  path: '/',
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Elms+Sans:ital,wght@0,300..800;1,300..800&family=Kaushan+Script&display=swap" rel="stylesheet" />
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
                  "logo": `${baseUrl}/kliamoLogo.png`,
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
      <body className={`${elmsSans.variable} ${kaushanScript.variable} ${elmsSans.className} h-full antialiased`}>
        <AppProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
