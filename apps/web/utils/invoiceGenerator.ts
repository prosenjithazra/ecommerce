import { getApiUrl } from '../components/ApiConfig';

export function normalizeOrderForInvoice(o: any) {
  if (!o) return null;

  // Handle items
  let items: any[] = [];
  if (o.items && Array.isArray(o.items) && typeof o.items[0] === 'object') {
    items = o.items;
  } else if (o.itemsJson && Array.isArray(o.itemsJson)) {
    items = o.itemsJson.map((it: any) => ({
      productId: it.productId,
      name: it.name || 'Custom Garment',
      price: Number(it.price || 0),
      quantity: Number(it.quantity || 1),
      image: it.image || '/kliamologoNew.png',
      size: it.size || 'M',
      color: it.color || 'Default',
      colorHex: it.colorHex,
      category: it.category,
      customDesign: it.customDesign
    }));
  } else if (typeof o.itemsJson === 'string') {
    try {
      const parsed = JSON.parse(o.itemsJson);
      if (Array.isArray(parsed)) {
        items = parsed.map((it: any) => ({
          productId: it.productId,
          name: it.name || 'Custom Garment',
          price: Number(it.price || 0),
          quantity: Number(it.quantity || 1),
          image: it.image || '/kliamologoNew.png',
          size: it.size || 'M',
          color: it.color || 'Default',
          colorHex: it.colorHex,
          category: it.category,
          customDesign: it.customDesign
        }));
      }
    } catch { }
  }

  if (items.length === 0) {
    items = [
      {
        productId: 'standard',
        name: 'Order Item',
        price: Number(o.total || 0),
        quantity: Number(o.items || 1),
        image: '/kliamologoNew.png',
        size: 'M',
        color: 'White'
      }
    ];
  }

  // Handle address
  let address = o.address;
  if (!address && o.itemsJson && Array.isArray(o.itemsJson) && o.itemsJson[0]?.address) {
    address = o.itemsJson[0].address;
  } else if (!address && typeof o.itemsJson === 'string') {
    try {
      const parsed = JSON.parse(o.itemsJson);
      if (Array.isArray(parsed) && parsed[0]?.address) {
        address = parsed[0].address;
      }
    } catch { }
  }

  if (!address) {
    address = {
      id: 'default',
      fullName: o.customer || 'Customer',
      street: 'Standard Address',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      phone: '',
      isDefault: true
    };
  }

  const itemsSubtotal = Math.round(items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0) * 100) / 100;
  const subtotal = typeof o.subtotal === 'number' && o.subtotal > 0 ? o.subtotal : itemsSubtotal;
  const tax = typeof o.tax === 'number' && o.tax > 0 ? o.tax : Math.round(subtotal * 0.05 * 100) / 100;
  const discountAmount = typeof o.discountAmount === 'number' ? o.discountAmount : 0;
  const couponCode = o.couponCode || o.coupon || null;
  const storedTotal = Number(o.total || 0);

  let shippingFee = typeof o.shippingFee === 'number' && o.shippingFee > 0 ? o.shippingFee : undefined;
  if (shippingFee === undefined) {
    if (storedTotal > 0 && Math.abs(storedTotal - (subtotal + tax - discountAmount)) > 0.01) {
      shippingFee = Math.max(0, Math.round((storedTotal - (subtotal + tax - discountAmount)) * 100) / 100);
    } else {
      shippingFee = (subtotal > 999 || subtotal === 0) ? 0 : 49;
    }
  }

  const total = storedTotal > 0 ? storedTotal : Math.max(0, Math.round((subtotal + tax + shippingFee - discountAmount) * 100) / 100);

  const isCodOrder = (o.paymentMethod || '').toUpperCase().includes('COD') || !!o.isPartialCod;
  const paidAmount = typeof o.paidAmount === 'number' && o.paidAmount >= 0 ? o.paidAmount : (isCodOrder ? Math.round(total * 0.5 * 100) / 100 : total);
  const codAmount = typeof o.codAmount === 'number' && o.codAmount >= 0 ? o.codAmount : (isCodOrder ? Math.max(0, Math.round((total - paidAmount) * 100) / 100) : 0);
  const isPartialCod = isCodOrder && codAmount > 0;

  return {
    id: o.id,
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')),
    status: o.status || 'Processing',
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    couponCode,
    total: Number(total.toFixed(2)),
    paidAmount: Number(paidAmount.toFixed(2)),
    codAmount: Number(codAmount.toFixed(2)),
    isPartialCod,
    address: o.address || o.shippingAddress,
    paymentMethod: o.paymentMethod || (isPartialCod ? 'COD (50% Advance)' : 'CARD'),
    paymentId: o.paymentId,
    paymentStatus: o.paymentStatus || (isPartialCod ? 'PARTIALLY PAID' : 'PAID'),
    trackingNumber: o.trackingNumber,
    items,
    itemsJson: o.itemsJson,
    email: o.email
  };
}

export function printPdfInvoice(order: any, companySettings?: any) {
  if (!order || typeof window === 'undefined') return;

  const normalized = normalizeOrderForInvoice(order) || order;

  const invoiceWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!invoiceWindow) {
    alert('Please allow popups to generate and print your PDF invoice.');
    return;
  }

  const origin = window.location.origin;
  const logoUrl = `${origin}/kliamologoNew.png`;

  const items = normalized.items || [];
  const itemsJson = normalized.itemsJson || [];
  const totalAmount = Number(normalized.total || 0);
  const subtotalVal = typeof normalized.subtotal === 'number' && normalized.subtotal >= 0 ? normalized.subtotal : (totalAmount > 0 ? Math.round((totalAmount / 1.05) * 100) / 100 : 0);
  const taxVal = typeof normalized.tax === 'number' && normalized.tax >= 0 ? normalized.tax : Math.round(subtotalVal * 0.05 * 100) / 100;
  const shippingVal = typeof normalized.shippingFee === 'number' && normalized.shippingFee >= 0 ? normalized.shippingFee : 0;
  const discountVal = typeof normalized.discountAmount === 'number' ? normalized.discountAmount : 0;
  const couponCodeStr = normalized.couponCode || '';

  const compEmail = companySettings?.email || 'support@kliamofashion.com';
  const compPhone = companySettings?.phone || '+1 555-0199';
  const compAddr = companySettings?.address || '123 Creative St, New York, NY 10001';

  const itemsHtml = items.map((item: any, idx: number) => {
    const itemMeta = itemsJson[idx] || {};
    const customDesign = itemMeta.customDesign || item.customDesign;
    let frontImg = customDesign?.frontMockupUrl || customDesign?.frontDesignUrl || item.image || '/kliamologoNew.png';
    let backImg = customDesign?.backMockupUrl || customDesign?.backDesignUrl;

    if (frontImg && frontImg.startsWith('/')) frontImg = origin + frontImg;
    if (backImg && backImg.startsWith('/')) backImg = origin + backImg;

    return `
      <tr style="border-bottom: 1px solid #E4E4E7;">
        <td style="padding: 12px; vertical-align: top;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="display: flex; gap: 4px;">
              <img src="${frontImg}" alt="Front View" style="width: 52px; height: 52px; object-fit: contain; border: 1px solid #E4E4E7; border-radius: 6px; background: #FDFAF6;" />
              ${backImg ? `<img src="${backImg}" alt="Back View" style="width: 52px; height: 52px; object-fit: contain; border: 1px solid #E4E4E7; border-radius: 6px; background: #FDFAF6;" />` : ''}
            </div>
            <div>
              <strong style="font-size: 13px; color: #18181B;">${item.name || 'Custom Garment'}</strong>
              <div style="font-size: 11px; color: #71717A; margin-top: 2px;">
                Size: <b>${item.size || 'M'}</b> | Color: <b>${item.color || 'Default'}</b>${item.category ? ` | Category: <b>${item.category}</b>` : ''}
              </div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: center; font-size: 12px; color: #18181B; vertical-align: middle;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px; text-align: right; font-size: 12px; color: #18181B; vertical-align: middle;">
          ₹${Number(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
        <td style="padding: 12px; text-align: right; font-size: 12px; font-weight: bold; color: #18181B; vertical-align: middle;">
          ₹${(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
      </tr>
    `;
  }).join('');

  const address = normalized.address || {};
  const customerName = address.fullName || normalized.customer || 'Customer';
  const street = address.street || 'Standard Address';
  const cityStateZip = [address.city, address.state, address.zip].filter(Boolean).join(', ');
  const country = address.country || 'India';
  const phone = address.phone || 'N/A';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice #${normalized.id} - KLIAMO Fashion</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #18181B;
            margin: 0;
            padding: 32px;
            background: #FFFFFF;
            -webkit-print-color-adjust: exact;
          }
          .invoice-box {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #F4F4F5;
            padding-bottom: 24px;
            margin-bottom: 24px;
          }
          .logo {
            height: 64px;
            max-width: 220px;
            object-fit: contain;
            display: block;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #18181B;
            text-align: right;
            letter-spacing: -0.5px;
          }
          .sub-title {
            font-size: 12px;
            color: #71717A;
            margin-top: 4px;
            text-align: right;
          }
          .grid-2 {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 32px;
          }
          .info-block {
            flex: 1;
            font-size: 12px;
            color: #52525B;
            line-height: 1.6;
          }
          .info-block strong {
            color: #18181B;
            font-size: 13px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          th {
            background: #FDFAF6;
            border-bottom: 2px solid #E4E4E7;
            padding: 10px 12px;
            text-align: left;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #52525B;
          }
          .totals-table {
            width: 320px;
            margin-left: auto;
            border-collapse: collapse;
          }
          .totals-table td {
            padding: 6px 12px;
            font-size: 12px;
          }
          .totals-table tr.grand-total td {
            font-size: 15px;
            font-weight: 800;
            color: #df794d;
            border-top: 2px solid #18181B;
            padding-top: 10px;
          }
          .footer {
            margin-top: 48px;
            border-top: 1px solid #E4E4E7;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #A1A1AA;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          
          <div class="header">
            <div>
              <img src="${logoUrl}" alt="Kliamo Fashion Logo" class="logo" />
              <div style="font-size: 11px; color: #71717A; margin-top: 8px; line-height: 1.5;">
                <strong>Kliamo Fashion</strong><br />
                Address: ${compAddr}<br />
                Email: ${compEmail}<br />
                Phone: ${compPhone}
              </div>
            </div>
            <div>
              <div class="title">INVOICE RECEIPT</div>
              <div class="sub-title">Invoice No: <b>INV-${normalized.id}</b></div>
              <div class="sub-title">Date: <b>${normalized.date || new Date().toLocaleDateString('en-IN')}</b></div>
              <div class="sub-title">Status: <b style="color: #10B981; text-transform: uppercase;">${normalized.paymentStatus || 'PAID'}</b></div>
            </div>
          </div>

          <div class="grid-2">
            <div class="info-block">
              <strong>Billed & Shipped To:</strong><br />
              <b>${customerName}</b><br />
              ${street}<br />
              ${cityStateZip}<br />
              ${country}<br />
              Phone: <b>${phone}</b>
            </div>
            <div class="info-block" style="text-align: right;">
              <strong>Payment Details:</strong><br />
              Method: <b>${normalized.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Prepaid (Razorpay)'}</b><br />
              ${normalized.paymentId ? `Transaction ID: <b>${normalized.paymentId}</b><br />` : ''}
              Order Reference ID: <b>${normalized.id}</b>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item & Specifications</th>
                <th style="width: 12%; text-align: center;">Qty</th>
                <th style="width: 19%; text-align: right;">Unit Price</th>
                <th style="width: 19%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td style="color: #71717A;">Total Order Value:</td>
              <td style="text-align: right; font-weight: 700; color: #18181B;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="color: #71717A;">Items Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${subtotalVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="color: #71717A;">GST / Tax (5%):</td>
              <td style="text-align: right; font-weight: 600;">₹${taxVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ${discountVal > 0 ? `
            <tr>
              <td style="color: #DC2626; font-weight: 600;">Coupon Discount ${couponCodeStr ? `(${couponCodeStr})` : ''}:</td>
              <td style="text-align: right; font-weight: 700; color: #DC2626;">-₹${discountVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="color: #71717A;">Shipping Fee:</td>
              <td style="text-align: right; font-weight: 700; color: ${shippingVal === 0 ? '#10B981' : '#18181B'};">
                ${shippingVal === 0 ? 'FREE' : `₹${shippingVal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </td>
            </tr>
            <tr class="grand-total">
              <td style="color: #10B981;">50% Advance Online Paid:</td>
              <td style="text-align: right; color: #10B981;">₹${Number(normalized.paidAmount || (normalized.isPartialCod ? totalAmount * 0.5 : totalAmount)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ${normalized.isPartialCod || (normalized.codAmount && normalized.codAmount > 0) ? `
            <tr style="font-size: 14px; font-weight: 800; color: #df794d;">
              <td style="padding-top: 6px;">50% COD Due on Delivery:</td>
              <td style="text-align: right; padding-top: 6px; color: #df794d;">₹${Number(normalized.codAmount || totalAmount * 0.5).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
            ` : ''}
          </table>

          <div class="footer">
            <p style="font-weight: 700; color: #52525B; margin-bottom: 4px;">Thank you for shopping with Kliamo Fashion India!</p>
            <p style="margin: 0;">This is an official computer-generated receipt requiring no physical signature.</p>
          </div>

        </div>

        <script>
          window.onload = function() {
            var imgs = document.images;
            var loaded = 0;
            var total = imgs.length;
            function triggerPrint() {
              setTimeout(function() {
                window.print();
              }, 400);
            }
            if (total === 0) {
              triggerPrint();
              return;
            }
            for (var i = 0; i < total; i++) {
              if (imgs[i].complete) {
                loaded++;
                if (loaded === total) triggerPrint();
              } else {
                imgs[i].onload = imgs[i].onerror = function() {
                  loaded++;
                  if (loaded === total) triggerPrint();
                };
              }
            }
          };
        </script>
      </body>
    </html>
  `;

  invoiceWindow.document.open();
  invoiceWindow.document.write(htmlContent);
  invoiceWindow.document.close();
}

export async function downloadOrderInvoice(orderId: string, existingOrder?: any, companySettings?: any) {
  let targetOrder = existingOrder ? normalizeOrderForInvoice(existingOrder) : null;
  let settings = companySettings;

  if (!settings) {
    try {
      const sRes = await fetch(getApiUrl('/settings')).catch(() => null);
      if (sRes && sRes.ok) {
        settings = await sRes.json();
      }
    } catch { }
  }

  // Fetch full details from API if items or address detail is missing
  if ((!targetOrder || !targetOrder.items || targetOrder.items.length === 0 || !targetOrder.address?.street) && orderId) {
    try {
      const res = await fetch(getApiUrl(`/orders/${encodeURIComponent(orderId)}`));
      if (res.ok) {
        const text = await res.text();
        const data = text ? JSON.parse(text) : null;
        if (data) {
          const apiOrder = normalizeOrderForInvoice(data);
          if (apiOrder) targetOrder = apiOrder;
        }
      }
    } catch (err) {
      console.error("Error fetching order from API for invoice:", err);
    }
  }

  if (!targetOrder && orderId) {
    targetOrder = normalizeOrderForInvoice({
      id: orderId,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Processing',
      total: existingOrder?.total || 0,
      paymentStatus: 'PAID',
      paymentMethod: 'CARD',
    });
  }

  if (targetOrder) {
    printPdfInvoice(targetOrder, settings);
  }
}

