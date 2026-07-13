import { PolicyPage } from "../PolicyPage";
import type { PolicySection } from "../PolicyPage";

const sections: PolicySection[] = [
  {
    id: "sh1",
    heading: "Processing Time",
    content: "All print-on-demand orders require a production period of 2–4 business days for printing, quality checking, and packaging before dispatch. This processing time is separate from the shipping transit time. Orders placed on weekends or public holidays begin processing the next working day.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "sh2",
    heading: "Domestic Shipping (India)",
    content: "Standard shipping within India typically takes 4–7 business days after dispatch. Express shipping (2–3 business days) is available for select pin codes at an additional charge. Free shipping is offered on all orders above ₹999.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "sh3",
    heading: "International Shipping",
    content: "We currently ship to 30+ countries via registered air mail and international courier partners. International orders typically arrive within 12–21 business days. Customs duties, import taxes, and additional fees levied by the destination country are the responsibility of the recipient.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "sh4",
    heading: "Order Tracking",
    content: "Once your order is dispatched, you will receive a tracking number via email and SMS. You can track your order in real-time from the Orders section of your PrintHub account or directly on the courier partner's website.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "sh5",
    heading: "Shipping Partners",
    content: "We partner with Delhivery, Blue Dart, DTDC, FedEx, and India Post for domestic and international deliveries. The shipping partner assigned to your order is determined automatically based on your delivery pin code and order weight.",
    lastUpdated: "2026-07-01",
  },
  {
    id: "sh6",
    heading: "Lost or Delayed Shipments",
    content: "If your order has not arrived within the estimated delivery window, please contact our support team at support@printhub.com. We will initiate a shipment investigation and provide a resolution (re-dispatch or refund) within 7 business days.",
    lastUpdated: "2026-07-01",
  },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      subtitle="Define delivery timelines, partners, and shipping rules"
      accentColor="#60a5fa"
      initialSections={sections}
    />
  );
}
