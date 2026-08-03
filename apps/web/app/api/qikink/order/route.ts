import { NextResponse } from 'next/server';
import { getAccessToken } from '../../../../lib/qikink/auth';
import { getApiUrl } from '../../../../components/ApiConfig';

const QIKINK_COLOR_CODES: Record<string, string> = {
  'white': 'Wh',
  'black': 'Bk',
  'grey': 'Gy',
  'heather grey': 'Gy',
  'navy': 'Ny',
  'navy blue': 'Ny',
  'green': 'Gn',
  'forest green': 'Gn',
  'red': 'Rd',
  'crimson red': 'Rd',
  'blue': 'Bl',
  'royal blue': 'Rbl',
  'yellow': 'Yl',
};

export async function POST(request: Request) {
  try {
    const { orderId, address, cart, gateway, total, email } = await request.json();

    const clientId = process.env.QIKINK_CLIENT_ID;
    const clientSecret = process.env.QIKINK_CLIENT_SECRET;
    const apiUrl = process.env.QIKINK_API_URL || 'https://api.qikink.com';

    if (!clientId || !clientSecret || clientId === 'your_client_id_here') {
      return NextResponse.json(
        { error: 'Qikink credentials not configured. Please set QIKINK_CLIENT_ID and QIKINK_CLIENT_SECRET in .env.local' },
        { status: 500 }
      );
    }

    // 1. Get Authentication Access Token from Qikink (supports caching & handles Accesstoken response key)
    let accessToken: string;
    try {
      accessToken = await getAccessToken();
    } catch (authErr: any) {
      // Fallback manual request if getAccessToken fails
      const tokenResponse = await fetch(`${apiUrl}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ClientId: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        return NextResponse.json(
          { error: `Qikink Auth Failed: ${errText}` },
          { status: tokenResponse.status }
        );
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.Accesstoken || tokenData.access_token || tokenData.accessToken;
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token received from Qikink API.' },
        { status: 500 }
      );
    }

    // 2. Prepare Order Payload for Qikink (sanitize order_number to max 15 alphanumeric characters as required by Qikink API)
    const customerFullName = address?.fullName || 'Customer';
    const nameParts = customerFullName.trim().split(/\s+/);
    const first_name = nameParts[0] || 'Customer';
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const rawOrderNum = String(orderId).replace(/[^a-zA-Z0-9]/g, '');
    const cleanOrderNumber = rawOrderNum.length > 15 ? rawOrderNum.slice(-15) : (rawOrderNum || `ORD${Date.now().toString().slice(-8)}`);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://kliamo.com';

    const formatPublicImg = (imgUrl?: string) => {
      if (!imgUrl || typeof imgUrl !== 'string') return 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg';
      if (imgUrl.startsWith('/')) return `${appUrl.replace(/\/+$/, '')}${imgUrl}`;
      return imgUrl;
    };

    const lineItems = await Promise.all(
      (cart || []).map(async (item: any) => {
        const customDesign = item.customDesign;
        let designMeta: any = null;
        if (customDesign?.baseImage) {
          if (typeof customDesign.baseImage === 'string') {
            try { designMeta = JSON.parse(customDesign.baseImage); } catch {}
          } else {
            designMeta = customDesign.baseImage;
          }
        }
        if (!designMeta && customDesign && typeof customDesign === 'object') {
          designMeta = customDesign;
        }

        // Fetch product to retrieve custom skuMapping or base SKU
        let resolvedSku = item.sku || '';
        let categoryName = item.category || '';
        try {
          const productRes = await fetch(getApiUrl(`/products/${item.productId}`));
          if (productRes.ok) {
            const product = await productRes.json();
            categoryName = product.category || categoryName;
            const colorName = item.color || 'White';
            const sizeName = item.size || 'M';
            const variationKey = `${colorName}_${sizeName}`.trim(); // e.g. "White_M" or "Black_S"

            if (product.skuMapping && product.skuMapping[variationKey]) {
              resolvedSku = product.skuMapping[variationKey];
            } else if (product.sku) {
              const basePart = product.sku;
              const colorCode = QIKINK_COLOR_CODES[colorName.toLowerCase()] || 'Wh';
              const sizeCode = (sizeName || 'M').toUpperCase();
              resolvedSku = `${basePart}-${colorCode}-${sizeCode}`;
            }
          }
        } catch (err) {
          console.error(`Error resolving variation SKU for product ${item.productId}:`, err);
        }

        const colorCode = QIKINK_COLOR_CODES[(item.color || 'White').toLowerCase()] || 'Wh';
        const sizeCode = (item.size || 'M').toUpperCase();
        const catLower = `${categoryName} ${item.name || ''}`.toLowerCase();

        if (item.search_from_my_products === 1 || item.isQikinkSynced) {
          resolvedSku = item.sku || resolvedSku || `${item.productId}-${sizeCode}-${colorCode}`;
        } else if (!resolvedSku || resolvedSku.startsWith('PHT-') || resolvedSku.startsWith('PHH-') || !resolvedSku.includes('-')) {
          let basePrefix = 'MVnTs'; // Default to Men's Round Neck T-Shirt
          if (catLower.includes('hoodie')) {
            basePrefix = 'MVnHs';
          } else if (catLower.includes('polo')) {
            basePrefix = 'MPlHs';
          } else if (catLower.includes('sweatshirt')) {
            basePrefix = 'MSwFs';
          } else if (catLower.includes('oversize')) {
            basePrefix = 'MOvTs';
          } else if (catLower.includes('v neck') || catLower.includes('v-neck')) {
            basePrefix = 'MVnVs';
          } else if (catLower.includes('cap') || catLower.includes('accessory')) {
            basePrefix = 'ACpCv';
          } else if (catLower.includes('jacket')) {
            basePrefix = 'MJkSl';
          } else if (catLower.includes('mug')) {
            basePrefix = 'AMgCm';
          }
          resolvedSku = `${basePrefix}-${colorCode}-${sizeCode}`;
        }

        const fallbackImageUrl = formatPublicImg(item.image || item.primaryImage);
        const frontDesign = formatPublicImg(designMeta?.rawFrontArtworkUrl || designMeta?.frontDesignUrl || designMeta?.front?.imageUrl || item.customDesign?.frontDesignUrl);
        const frontMockup = formatPublicImg(designMeta?.frontMockupUrl || item.customDesign?.frontMockupUrl || frontDesign);

        const backDesign = designMeta?.rawBackArtworkUrl || designMeta?.backDesignUrl || designMeta?.back?.imageUrl || item.customDesign?.backDesignUrl ? formatPublicImg(designMeta?.rawBackArtworkUrl || designMeta?.backDesignUrl || designMeta?.back?.imageUrl || item.customDesign?.backDesignUrl) : null;
        const backMockup = designMeta?.backMockupUrl || item.customDesign?.backMockupUrl || backDesign ? formatPublicImg(designMeta?.backMockupUrl || item.customDesign?.backMockupUrl || backDesign) : null;

        const forceMyProducts = item.search_from_my_products === 1 || item.isQikinkSynced;

        if (forceMyProducts && !frontDesign && !backDesign) {
          return {
            sku: resolvedSku,
            quantity: String(item.quantity || 1),
            price: String(item.price || 0),
            search_from_my_products: 1,
          };
        }

        // Direct Print / Custom SKU Mode (search_from_my_products: 0)
        const designs: any[] = [];
        designs.push({
          design_code: `DSGNF${Date.now().toString().slice(-6)}`,
          placement_sku: 'fr',
          width_inches: '10',
          height_inches: '12',
          design_link: frontDesign || fallbackImageUrl,
          mockup_link: frontMockup || frontDesign || fallbackImageUrl,
        });

        if (backDesign) {
          designs.push({
            design_code: `DSGNB${Date.now().toString().slice(-6)}`,
            placement_sku: 'bk',
            width_inches: '10',
            height_inches: '12',
            design_link: backDesign,
            mockup_link: backMockup || backDesign,
          });
        }

        return {
          sku: resolvedSku,
          quantity: String(item.quantity || 1),
          price: String(item.price || 0),
          search_from_my_products: 0,
          print_type_id: 1,
          designs: designs,
        };
      })
    );

    const rawPhone = (address?.phone || '').replace(/\D/g, '');
    const cleanPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : '9876543210';
    const cleanZip = (address?.zip || '560001').replace(/[^a-zA-Z0-9]/g, '') || '560001';
    const customerEmail = email || address?.email || 'customer@example.com';

    const payload = {
      order_number: cleanOrderNumber,
      qikink_shipping: "1",
      gateway: gateway || 'Prepaid',
      total_order_value: String(total || 0),
      shipping_address: {
        first_name: first_name || 'Customer',
        last_name: last_name || '',
        address1: address?.street || '123 Main Street',
        address2: '',
        phone: cleanPhone,
        email: customerEmail,
        city: address?.city || 'Bengaluru',
        zip: cleanZip,
        province: address?.state || 'Karnataka',
        country_code: 'IN',
      },
      line_items: lineItems,
    };

    // 3. Post the order to Qikink
    let orderResponse = await fetch(`${apiUrl}/api/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'ClientId': clientId,
        'Accesstoken': accessToken,
      },
      body: JSON.stringify(payload),
    });

    // Auto-retry once on 401 Unauthorized by clearing cache and requesting a fresh token
    if (orderResponse.status === 401) {
      console.warn('Order submission returned 401 Unauthorized. Retrying with a fresh token...');
      try {
        const freshToken = await getAccessToken(true);
        orderResponse = await fetch(`${apiUrl}/api/order/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${freshToken}`,
            'ClientId': clientId,
            'Accesstoken': freshToken,
          },
          body: JSON.stringify(payload),
        });
      } catch (retryErr) {
        console.error('Failed to auto-refresh token during order creation retry:', retryErr);
      }
    }

    const orderText = await orderResponse.text();
    let orderResult: any = {};
    if (orderText && orderText.trim()) {
      try {
        orderResult = JSON.parse(orderText);
      } catch (err) {
        orderResult = { rawText: orderText };
      }
    }

    return NextResponse.json({
      success: orderResponse.ok,
      status: orderResponse.status,
      qikinkResponse: orderResult,
    });
  } catch (error: any) {
    console.error('Qikink Order Creation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
