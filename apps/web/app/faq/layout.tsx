import { Metadata } from 'next';
import { getMetadata, getBreadcrumbSchema } from '../../components/SeoConfig';

export const metadata: Metadata = getMetadata({
  title: 'Frequently Asked Questions',
  description: "Read answers to common queries regarding customization, order processing, shipping, sizing, and refund policies at Kliamo Fashion.",
  path: '/faq',
});

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  // Inject FAQ Schema (JSON-LD) dynamically in the layout
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What design file formats can I upload?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our canvas designer supports transparent PNGs, JPEGs, and SVGs. We highly recommend utilizing high-resolution transparent PNG files (at least 300 DPI) for clean direct-to-garment print lines."
        }
      },
      {
        "@type": "Question",
        "name": "Can I print on both the front and back of the shirt?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Use the 'Front / Back' view toggle in the design studio to add text layers and custom graphic images to both sides. Custom double-sided printing adds a minor ₹5 setup fee."
        }
      },
      {
        "@type": "Question",
        "name": "Can I add custom text and choose different fonts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Our Editor allows you to write custom text, choose from multiple premium fonts, resize, rotate, change line height, and select colors instantly."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a minimum order quantity (MOQ)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! There are absolutely no minimum limits. You can design and order a single t-shirt or fleece hoodie. Bulk orders of 15+ units automatically qualify for wholesale discounts."
        }
      },
      {
        "@type": "Question",
        "name": "What garment brands do you print on?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We print on premium organic apparel blanks from Bella+Canvas, Gildan, and Champion. Specific materials (organic cotton, heavyweight fleece) are listed under each product details page."
        }
      },
      {
        "@type": "Question",
        "name": "How durable is the direct-to-garment (DTG) print?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We use state-of-the-art DTG machines and eco-friendly water-based inks. With proper care (machine wash cold, inside out, line dry), the prints will last as long as the garment itself."
        }
      },
      {
        "@type": "Question",
        "name": "How do I track my shipment package?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Once printed and handed over to DHL Express, a tracking ID is generated. You can input this under your dashboard orders list or track the timeline details directly inside our Track Order page."
        }
      },
      {
        "@type": "Question",
        "name": "Can I return an item if it doesn't fit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Because items are custom printed on demand, we do not accept returns for incorrect size selection. Please consult our sizing guides before checking out. If you receive a damaged blank or alignment print error, we send a replacement free of charge."
        }
      },
      {
        "@type": "Question",
        "name": "How long does shipping and fulfillment take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fulfillment (printing and packaging) takes 2-3 business days. Courier transit takes another 3-5 business days depending on your location."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
