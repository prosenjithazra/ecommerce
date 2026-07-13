import { PolicyPage } from "../PolicyPage";
import type { PolicySection } from "../PolicyPage";

const sections: PolicySection[] = [
  {
    id: "p1",
    heading: "Information We Collect",
    content: "We collect the following types of information: (1) Account Information — name, email address, and phone number provided during registration. (2) Order & Design Data — shipping addresses, product selections, and uploaded design assets. (3) Payment Information — processed securely by our PCI-compliant payment gateway; we do not store card numbers. (4) Usage Data — pages visited, features used, and device/browser information for analytics purposes.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "p2",
    heading: "How We Use Your Data",
    content: "Your personal information is used to: process and fulfil your print orders; send order confirmation and shipping notification emails; provide customer support; improve our platform using aggregated, anonymized analytics; and comply with legal obligations. We do not use your data for third-party advertising.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "p3",
    heading: "Data Sharing & Third Parties",
    content: "We share your information only with trusted partners required to fulfil your order: our print partner (Qikink API), logistics partners (Delhivery, FedEx, etc.), and payment processors. These parties are contractually bound to protect your data and use it only for order fulfilment purposes. We do not sell your personal data.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "p4",
    heading: "Data Retention",
    content: "We retain your account and order data for a period of 3 years from your last transaction. Design assets uploaded to the studio are stored for 90 days after order completion and then permanently deleted. You may request early deletion of your data by contacting support.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "p5",
    heading: "Cookies & Tracking",
    content: "We use essential cookies to manage sessions and shopping carts. Analytics cookies (Google Analytics) help us understand platform usage. You may disable non-essential cookies via your browser settings; however, this may impact certain platform features.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "p6",
    heading: "Your Rights",
    content: "Under applicable data protection laws, you have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your account and associated data; withdraw consent for marketing communications at any time. To exercise any of these rights, email privacy@printhub.com.",
    lastUpdated: "2026-07-01",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      subtitle="Manage how customer data is collected, stored, and shared"
      accentColor="#10b981"
      initialSections={sections}
    />
  );
}
