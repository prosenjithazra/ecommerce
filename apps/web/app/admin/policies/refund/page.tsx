import { PolicyPage } from "../PolicyPage";
import type { PolicySection } from "../PolicyPage";

const sections: PolicySection[] = [
  {
    id: "r1",
    heading: "Eligibility for Refund",
    content: "Refunds are accepted for items that are defective, misprinted, or damaged during shipping. Claims must be submitted within 7 days of delivery with photographic evidence. Items that match the approved design proof are not eligible for a refund based on customer preference.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "r2",
    heading: "Non-Refundable Items",
    content: "Custom-designed products that have been correctly printed as per the submitted artwork are non-refundable. Sale or discounted items, digital downloads, and design studio credits are also non-refundable.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "r3",
    heading: "Refund Process & Timeline",
    content: "Once a refund claim is approved, the refund will be processed to the original payment method within 5–7 business days. For prepaid orders, the amount is credited back to your bank account or UPI wallet. COD refunds are processed via NEFT bank transfer.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "r4",
    heading: "Reprints",
    content: "As an alternative to a refund, we offer a free reprint for defective or incorrect orders. The reprint will be dispatched within 3–5 business days after approval. You are not required to return the faulty item.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "r5",
    heading: "How to Submit a Claim",
    content: "Email our support team at support@printhub.com with your Order ID, clear photos of the issue, and a brief description. Our team will respond within 24 business hours to guide you through the resolution process.",
    lastUpdated: "2026-07-01",
  },
];

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      subtitle="Define and manage refund eligibility rules for customers"
      accentColor="#F9A37E"
      initialSections={sections}
    />
  );
}
