import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyType, PolicySectionItem } from './schemas/policy.schema';

const DEFAULT_POLICIES: Record<PolicyType, { title: string; subtitle: string; sections: PolicySectionItem[] }> = {
  refund: {
    title: 'Refund Policy',
    subtitle: 'Define and manage refund eligibility rules for customers',
    sections: [
      {
        id: 'r1',
        heading: 'Eligibility for Refund',
        content: 'Refunds are accepted for items that are defective, misprinted, or damaged during shipping. Claims must be submitted within 7 days of delivery with photographic evidence. Items that match the approved design proof are not eligible for a refund based on customer preference.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'r2',
        heading: 'Non-Refundable Items',
        content: 'Custom-designed products that have been correctly printed as per the submitted artwork are non-refundable. Sale or discounted items, digital downloads, and design studio credits are also non-refundable.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'r3',
        heading: 'Refund Process & Timeline',
        content: 'Once a refund claim is approved, the refund will be processed to the original payment method within 5–7 business days. For prepaid orders, the amount is credited back to your bank account or UPI wallet. COD refunds are processed via NEFT bank transfer.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'r4',
        heading: 'Reprints',
        content: 'As an alternative to a refund, we offer a free reprint for defective or incorrect orders. The reprint will be dispatched within 3–5 business days after approval. You are not required to return the faulty item.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'r5',
        heading: 'How to Submit a Claim',
        content: 'Email our support team at support@printhub.com with your Order ID, clear photos of the issue, and a brief description. Our team will respond within 24 business hours to guide you through the resolution process.',
        lastUpdated: '2026-07-01',
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    subtitle: 'Manage fulfillment timeframes, delivery carriers, and shipping guidelines',
    sections: [
      {
        id: 's1',
        heading: 'Order Processing & Production Time',
        content: 'All products are printed on demand. Production typically takes 2–4 business days depending on design complexity and order volume before dispatching to courier partners.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 's2',
        heading: 'Shipping Rates & Estimated Delivery',
        content: 'Standard shipping takes 3–6 business days across metro cities in India and 5–8 days for non-metro locations. Shipping fees are calculated at checkout based on total weight and destination pincode.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 's3',
        heading: 'Real-time Order Tracking',
        content: 'Once your order is handed over to logistics partners (Bluedart, Delhivery, Shadowfax), an SMS and email notification containing your AWB tracking link will be sent automatically.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 's4',
        heading: 'Address Modifications',
        content: 'Shipping address changes can be requested within 12 hours of placing the order before production begins. Once dispatched, address re-routing may incur additional courier fees.',
        lastUpdated: '2026-07-01',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Storefront usage guidelines, copyright terms, and legal commitments',
    sections: [
      {
        id: 't1',
        heading: '1. Acceptance of Terms',
        content: 'By accessing Kliamo Fashion, using our design customizer, or placing custom print orders, you agree to be bound by these Terms & Conditions and applicable laws.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 't2',
        heading: '2. Intellectual Property & Artwork Ownership',
        content: 'You represent that you own all artwork, graphics, and design assets uploaded for printing. Kliamo Fashion holds no liability for copyright or trademark violations submitted by users.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 't3',
        heading: '3. Order Fulfillment & Cancellations',
        content: 'Orders are processed via automated printing pipelines. Order modifications or cancellations are only permitted before artwork enters the print queue (within 1 hour of payment).',
        lastUpdated: '2026-07-01',
      },
      {
        id: 't4',
        heading: '4. User Accounts',
        content: 'You are responsible for maintaining account confidentiality. We reserve the right to terminate accounts that upload offensive or infringing artwork.',
        lastUpdated: '2026-07-01',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Data protection standards, security policies, and user privacy rights',
    sections: [
      {
        id: 'p1',
        heading: '1. Data We Collect',
        content: 'We collect name, shipping address, contact details, payment transaction IDs, and uploaded graphics solely for processing and fulfilling merchandise orders.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'p2',
        heading: '2. Data Usage & Logistics Partners',
        content: 'Your information is shared only with verified printing and courier partners (Qikink, Bluedart, Razorpay) as required for delivery. We never sell user data.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'p3',
        heading: '3. Payment & Security Protocols',
        content: 'All payments are processed through PCI-DSS certified gateways using 256-bit SSL encryption. Card credentials are never stored on our servers.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'p4',
        heading: '4. User Data Rights',
        content: 'You have the right to inspect, update, or request deletion of your personal account data by emailing support@kliamofashion.com.',
        lastUpdated: '2026-07-01',
      },
    ],
  },
  faq: {
    title: 'Help Center / FAQ',
    subtitle: 'Frequently asked questions about ordering, sizing, printing, and shipping',
    sections: [
      {
        id: 'f1',
        heading: 'How do I place a custom print-on-demand order?',
        content: 'Browse our blank apparel catalog, choose your preferred garment style and color, upload your artwork in our customizer studio, select size, and proceed to checkout.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'f2',
        heading: 'What printing technologies do you use?',
        content: 'We utilize Direct-to-Garment (DTG) printing for detailed full-color graphics, DTF for durable vibrant prints, and premium embroidery for polo shirts and caps.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'f3',
        heading: 'Can I cancel or modify my order after placing it?',
        content: 'Orders enter production quickly. You can request cancellations within 1 hour of placing the order by contacting customer support.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'f4',
        heading: 'What sizes and fit options are available?',
        content: 'We provide detailed size charts on every product page ranging from S to 5XL. Please measure existing garments to select the ideal size.',
        lastUpdated: '2026-07-01',
      },
      {
        id: 'f5',
        heading: 'How do I track my order shipment?',
        content: 'Once shipped, you can track real-time parcel movements under My Orders or by entering your AWB tracking number on our tracking page.',
        lastUpdated: '2026-07-01',
      },
    ],
  },
};

@Injectable()
export class PoliciesService {
  constructor(@InjectModel(Policy.name) private policyModel: Model<Policy>) {}

  async findByType(type: string): Promise<Policy> {
    const normType = (type || '').toLowerCase().trim() as PolicyType;
    let policy = await this.policyModel.findOne({ type: normType });

    if (!policy && DEFAULT_POLICIES[normType]) {
      const def = DEFAULT_POLICIES[normType];
      policy = new this.policyModel({
        type: normType,
        title: def.title,
        subtitle: def.subtitle,
        sections: def.sections,
        isPublished: true,
      });
      await policy.save();
    }

    if (!policy) {
      throw new NotFoundException(`Policy type '${type}' not found`);
    }

    return policy;
  }

  async updatePolicy(type: string, data: { title?: string; subtitle?: string; sections: PolicySectionItem[] }): Promise<Policy> {
    const normType = (type || '').toLowerCase().trim() as PolicyType;
    let policy = await this.policyModel.findOne({ type: normType });

    const today = new Date().toISOString().split('T')[0];
    const updatedSections = (data.sections || []).map((s) => ({
      ...s,
      lastUpdated: s.lastUpdated || today,
    }));

    if (policy) {
      policy.sections = updatedSections;
      if (data.title) policy.title = data.title;
      if (data.subtitle) policy.subtitle = data.subtitle;
      return policy.save();
    } else {
      const def = DEFAULT_POLICIES[normType] || { title: `${type} Policy`, subtitle: 'Policy guidelines' };
      policy = new this.policyModel({
        type: normType,
        title: data.title || def.title,
        subtitle: data.subtitle || def.subtitle,
        sections: updatedSections,
        isPublished: true,
      });
      return policy.save();
    }
  }

  async findAll(): Promise<Policy[]> {
    // Ensure all 5 default policy types exist
    const types: PolicyType[] = ['refund', 'shipping', 'terms', 'privacy', 'faq'];
    for (const t of types) {
      await this.findByType(t);
    }
    return this.policyModel.find().exec();
  }
}
