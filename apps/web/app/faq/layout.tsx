import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kliamofashion.com';

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Read answers to common queries regarding customization, order processing, shipping, sizing, and refund policies at Kliamo Fashion.",
  alternates: {
    canonical: `${baseUrl}/faq`,
  },
  openGraph: {
    title: "FAQ | Kliamo Fashion",
    description: "Read answers to common queries regarding customization, order processing, and shipping.",
    url: `${baseUrl}/faq`,
  }
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  // Inject FAQ Schema (JSON-LD) dynamically in the layout
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does production and shipping take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every order is printed on demand. Production takes 2-3 business days, and shipping takes an additional 3-5 business days depending on location."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer returns or exchanges?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we accept returns on print errors, incorrect sizes, or damaged blanks within 30 days of delivery."
        }
      },
      {
        "@type": "Question",
        "name": "What printing methods do you use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use premium Direct-To-Garment (DTG) printing with eco-friendly water-based inks that produce brilliant colors and high durability."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
