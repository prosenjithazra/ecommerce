import { PolicyPage } from "../PolicyPage";
import type { PolicySection } from "../PolicyPage";

const sections: PolicySection[] = [
  {
    id: "t1",
    heading: "Acceptance of Terms",
    content: "By accessing or using the PrintHub platform, placing an order, or using the custom design studio, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t2",
    heading: "Intellectual Property & Design Ownership",
    content: "All designs submitted by customers for printing must be owned by the customer or licensed for commercial print use. PrintHub claims no ownership over customer-submitted designs. However, by submitting a design, you grant PrintHub a limited, non-exclusive license to use the design solely for the purpose of fulfilling your order.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t3",
    heading: "Prohibited Content",
    content: "PrintHub reserves the right to refuse any design that contains: hateful or discriminatory imagery, explicit or adult content, content that infringes on third-party trademarks or copyrights, or content that violates any applicable law. Violation of this policy may result in order cancellation and account suspension.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t4",
    heading: "Order Accuracy & Proofing",
    content: "Customers are responsible for reviewing and approving their design previews before placing an order. PrintHub is not liable for errors in spelling, colour, or design that were approved by the customer. We strongly recommend downloading and reviewing the design proof at 100% zoom before submitting.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t5",
    heading: "Account Termination",
    content: "PrintHub reserves the right to suspend or permanently terminate accounts that violate these terms, engage in fraudulent activity, file false claims, or attempt to abuse the refund system. Terminated accounts forfeit any pending store credits or loyalty points.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t6",
    heading: "Limitation of Liability",
    content: "PrintHub's liability in connection with any order is limited to the total amount paid for that specific order. We are not liable for indirect, incidental, or consequential damages including loss of revenue, profit, or data arising from the use of our services.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "t7",
    heading: "Governing Law",
    content: "These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal.",
    lastUpdated: "2026-07-01",
  },
];

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      subtitle="Legal terms governing use of the PrintHub platform and services"
      accentColor="#8b5cf6"
      initialSections={sections}
    />
  );
}
