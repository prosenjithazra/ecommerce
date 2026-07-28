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
    } catch {}
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
    } catch {}
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

  return {
    id: o.id,
    date: o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')),
    status: o.status || 'Processing',
    total: Number(o.total || 0),
    address,
    paymentMethod: o.paymentMethod || 'CARD',
    paymentId: o.paymentId,
    paymentStatus: o.paymentStatus || 'PAID',
    trackingNumber: o.trackingNumber,
    items,
    itemsJson: o.itemsJson,
    email: o.email
  };
}

export function printPdfInvoice(order: any) {
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
  const subtotal = (totalAmount / 1.05).toFixed(2);
  const taxGst = (totalAmount - Number(subtotal)).toFixed(2);

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
            color: #F9A37E;
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
              <img src="${logoUrl}" alt="Kliamo Fashion India Logo" class="logo" />
              <div style="font-size: 11px; color: #71717A; margin-top: 8px; line-height: 1.5;">
                <strong>Kliamo Fashion India</strong><br />
                Email: contact@kliamo.com<br />
                Website: kliamo.com
              </div>
            </div>
            <div>
              <div class="title">INVOICE RECEIPT</div>
              <div class="sub-title">Invoice No: <b>INV-${normalized.id}</b></div>
              <div class="sub-title">Date: <b>${normalized.date || new Date().toLocaleDateString('en-IN')}</b></div>
              <div class="sub-title">Payment Status: <b style="color: #10B981; text-transform: uppercase;">${normalized.paymentStatus || 'PAID'}</b></div>
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
              <td style="color: #71717A;">Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="color: #71717A;">Shipping Fee:</td>
              <td style="text-align: right; font-weight: 700; color: #10B981;">FREE</td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount Paid:</td>
              <td style="text-align: right;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
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

export async function downloadOrderInvoice(orderId: string, existingOrder?: any) {
  let targetOrder = existingOrder ? normalizeOrderForInvoice(existingOrder) : null;

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
    printPdfInvoice(targetOrder);
  }
}

