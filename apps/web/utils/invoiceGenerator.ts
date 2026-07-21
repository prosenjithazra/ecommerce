export function printPdfInvoice(order: any) {
  if (!order || typeof window === 'undefined') return;

  const invoiceWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!invoiceWindow) {
    alert('Please allow popups to generate and print your PDF invoice.');
    return;
  }

  const items = order.items || [];
  const itemsJson = order.itemsJson || [];
  const totalAmount = Number(order.total || 0);
  const subtotal = (totalAmount / 1.18).toFixed(2);
  const taxGst = (totalAmount - Number(subtotal)).toFixed(2);

  const itemsHtml = items.map((item: any, idx: number) => {
    const itemMeta = itemsJson[idx] || {};
    const customDesign = itemMeta.customDesign || item.customDesign;
    const frontImg = customDesign?.frontMockupUrl || customDesign?.frontDesignUrl || item.image || '/kliamologoNew.png';
    const backImg = customDesign?.backMockupUrl || customDesign?.backDesignUrl;

    return `
      <tr style="border-bottom: 1px solid #E4E4E7;">
        <td style="padding: 12px; vertical-align: top;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div style="display: flex; gap: 4px;">
              <img src="${frontImg}" alt="Front View" style="width: 50px; height: 50px; object-fit: contain; border: 1px solid #E4E4E7; border-radius: 6px; background: #FDFAF6;" />
              ${backImg ? `<img src="${backImg}" alt="Back View" style="width: 50px; height: 50px; object-fit: contain; border: 1px solid #E4E4E7; border-radius: 6px; background: #FDFAF6;" />` : ''}
            </div>
            <div>
              <strong style="font-size: 13px; color: #18181B;">${item.name || 'Custom Garment'}</strong>
              <div style="font-size: 11px; color: #71717A; margin-top: 2px;">
                Size: <b>${item.size || 'M'}</b> | Color: <b>${item.color || 'Default'}</b>
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

  const address = order.address || {};
  const customerName = address.fullName || order.customer || 'Customer';
  const street = address.street || 'Standard Address';
  const cityStateZip = [address.city, address.state, address.zip].filter(Boolean).join(', ');
  const country = address.country || 'India';
  const phone = address.phone || 'N/A';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${order.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          body {
            font-family: 'Inter', sans-serif;
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
            height: 48px;
            object-fit: contain;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            color: #18181B;
            text-align: right;
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
            background: #FAFFA6;
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
            width: 300px;
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
              <img src="/kliamologoNew.png" alt="KLIAMO Logo" class="logo" />
              <div style="font-size: 11px; color: #71717A; margin-top: 6px;">
                KLIAMO Custom Apparel Studio<br />
                GSTIN: 29AAAAA0000A1Z5<br />
                Support: support@kliamo.com
              </div>
            </div>
            <div>
              <div class="title">TAX INVOICE</div>
              <div class="sub-title">Invoice No: <b>INV-${order.id}</b></div>
              <div class="sub-title">Date: ${order.date || new Date().toLocaleDateString('en-IN')}</div>
              <div class="sub-title">Status: <b style="color: #10B981; text-transform: uppercase;">${order.paymentStatus || 'PAID'}</b></div>
            </div>
          </div>

          <div class="grid-2">
            <div class="info-block">
              <strong>Billed & Shipped To:</strong><br />
              <b>${customerName}</b><br />
              ${street}<br />
              ${cityStateZip}<br />
              ${country}<br />
              Phone: ${phone}
            </div>
            <div class="info-block" style="text-align: right;">
              <strong>Payment Information:</strong><br />
              Method: <b>${order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Prepaid'}</b><br />
              ${order.paymentId ? `Transaction ID: <b>${order.paymentId}</b><br />` : ''}
              Order Reference: <b>${order.id}</b>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 17.5%; text-align: right;">Unit Price</th>
                <th style="width: 17.5%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td style="color: #71717A;">Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="color: #71717A;">GST (18% Included):</td>
              <td style="text-align: right; font-weight: 600;">₹${taxGst}</td>
            </tr>
            <tr>
              <td style="color: #71717A;">Shipping:</td>
              <td style="text-align: right; font-weight: 600; color: #10B981;">FREE</td>
            </tr>
            <tr class="grand-total">
              <td>Total Paid:</td>
              <td style="text-align: right;">₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          </table>

          <div class="footer">
            <p style="font-weight: 600; color: #52525B; margin-bottom: 4px;">Thank you for your order with KLIAMO Custom Apparel!</p>
            <p>This is a computer-generated tax invoice and requires no physical signature.</p>
          </div>

        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  invoiceWindow.document.open();
  invoiceWindow.document.write(htmlContent);
  invoiceWindow.document.close();
}
