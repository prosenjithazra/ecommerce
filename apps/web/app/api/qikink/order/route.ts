import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, address, cart, gateway, total } = await request.json();

    const clientId = process.env.QIKINK_CLIENT_ID;
    const clientSecret = process.env.QIKINK_CLIENT_SECRET;
    const apiUrl = process.env.QIKINK_API_URL || 'https://sandbox.qikink.com';

    if (!clientId || !clientSecret || clientId === 'your_client_id_here') {
      return NextResponse.json(
        { error: 'Qikink credentials not configured. Please set QIKINK_CLIENT_ID and QIKINK_CLIENT_SECRET in .env.local' },
        { status: 500 }
      );
    }

    // 1. Get Authentication Access Token from Qikink
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
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token received from Qikink API.' },
        { status: 500 }
      );
    }

    // 2. Prepare Order Payload for Qikink
    const first_name = address.fullName.split(' ')[0] || address.fullName;
    const last_name = address.fullName.split(' ').slice(1).join(' ') || "";

    const payload = {
      order_number: orderId,
      qikink_shipping: 1, // Let Qikink handle shipping
      gateway: gateway || 'PREPAID',
      total_order_value: total,
      shipping_address: {
        first_name,
        last_name,
        address1: address.street,
        address2: '',
        phone: address.phone,
        email: 'customer@example.com',
        city: address.city,
        zip: address.zip,
        province: address.state,
        country_code: 'IN', // Default to India
      },
      line_items: cart.map((item: any) => ({
        sku: `${item.productId}-${item.size}-${item.color}`.replace(/\s+/g, '-').toUpperCase(),
        quantity: item.quantity,
        price: item.price.toString(),
      })),
    };

    // 3. Post the order to Qikink
    const orderResponse = await fetch(`${apiUrl}/api/order/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ClientId': clientId,
        'Accesstoken': accessToken,
      },
      body: JSON.stringify(payload),
    });

    const orderResult = await orderResponse.json();

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
