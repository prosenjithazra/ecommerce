import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const DEFAULT_SECTIONS: Record<string, { title: string; subtitle: string; sections: any[] }> = {
  refund: {
    title: 'Refund Policy',
    subtitle: 'Define and manage refund eligibility rules for customers',
    sections: [
      { id: 'r1', heading: 'Eligibility for Refund', content: 'Refunds are accepted for items that are defective, misprinted, or damaged during shipping. Claims must be submitted within 7 days of delivery with photographic evidence.', lastUpdated: '2026-07-01' },
      { id: 'r2', heading: 'Non-Refundable Items', content: 'Custom-designed products that have been correctly printed as per the submitted artwork are non-refundable.', lastUpdated: '2026-07-01' },
      { id: 'r3', heading: 'Refund Process & Timeline', content: 'Approved refunds are processed to the original payment method within 5–7 business days.', lastUpdated: '2026-07-01' },
      { id: 'r4', heading: 'Reprints', content: 'As an alternative to a refund, we offer a free reprint for defective or incorrect orders.', lastUpdated: '2026-07-01' },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    subtitle: 'Manage fulfillment timeframes, delivery carriers, and shipping guidelines',
    sections: [
      { id: 's1', heading: 'Order Processing & Production Time', content: 'All products are printed on demand. Production typically takes 2–4 business days before dispatching.', lastUpdated: '2026-07-01' },
      { id: 's2', heading: 'Shipping Rates & Estimated Delivery', content: 'Standard shipping takes 3–6 business days across metro cities in India.', lastUpdated: '2026-07-01' },
      { id: 's3', heading: 'Real-time Order Tracking', content: 'Once shipped, an SMS and email containing your AWB tracking link will be sent automatically.', lastUpdated: '2026-07-01' },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Storefront usage guidelines, copyright terms, and legal commitments',
    sections: [
      { id: 't1', heading: '1. Acceptance of Terms', content: 'By accessing Kliamo Fashion, placing custom print orders, or using our design customizer, you agree to these Terms.', lastUpdated: '2026-07-01' },
      { id: 't2', heading: '2. Intellectual Property', content: 'You represent that you own all artwork uploaded for printing. Kliamo Fashion holds no liability for copyright infringement.', lastUpdated: '2026-07-01' },
      { id: 't3', heading: '3. Order Fulfillment', content: 'Cancellations are accepted only before artwork enters production.', lastUpdated: '2026-07-01' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Data protection standards, security policies, and user privacy rights',
    sections: [
      { id: 'p1', heading: '1. Data We Collect', content: 'We collect name, delivery address, contact details, and payment metadata strictly to fulfill orders.', lastUpdated: '2026-07-01' },
      { id: 'p2', heading: '2. Data Sharing', content: 'Your information is shared only with verified logistics partners (Qikink, courier services) as required for delivery.', lastUpdated: '2026-07-01' },
      { id: 'p3', heading: '3. Payment Security', content: 'All payments are processed through PCI-compliant gateways using SSL encryption.', lastUpdated: '2026-07-01' },
    ],
  },
  faq: {
    title: 'Help Center / FAQ',
    subtitle: 'Frequently asked questions about ordering, sizing, printing, and shipping',
    sections: [
      { id: 'f1', heading: 'How do I place a custom print-on-demand order?', content: 'Browse our blank apparel catalog, choose your preferred garment style and color, upload your artwork, select size, and checkout.', lastUpdated: '2026-07-01' },
      { id: 'f2', heading: 'What printing technologies do you use?', content: 'We utilize Direct-to-Garment (DTG), DTF, and premium embroidery for customized apparel.', lastUpdated: '2026-07-01' },
      { id: 'f3', heading: 'How do I track my order shipment?', content: 'Once shipped, track real-time parcel movements under My Orders or by entering your AWB tracking number on our tracking page.', lastUpdated: '2026-07-01' },
    ],
  },
};

export async function GET(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const normType = (type || '').toLowerCase().trim();

  try {
    const res = await fetch(`${BACKEND_URL}/policies/${normType}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error(`[API Policy GET] Error fetching policy '${normType}' from backend:`, error);
  }

  const fallback = DEFAULT_SECTIONS[normType] || { title: `${type} Policy`, subtitle: 'Policy details', sections: [] };
  return NextResponse.json({ type: normType, ...fallback });
}

export async function PUT(req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const normType = (type || '').toLowerCase().trim();

  try {
    const body = await req.json();
    const res = await fetch(`${BACKEND_URL}/policies/${normType}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    const errText = await res.text();
    return NextResponse.json({ error: errText || 'Failed to update policy' }, { status: res.status });
  } catch (error: any) {
    console.error(`[API Policy PUT] Error updating policy '${normType}':`, error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
