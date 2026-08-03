import { NextResponse } from 'next/server';
import { getAccessToken, forceRefreshAccessToken } from '../../../../lib/qikink/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    let token: string;
    if (forceRefresh) {
      token = await forceRefreshAccessToken();
    } else {
      token = await getAccessToken();
    }

    const clientId = process.env.QIKINK_CLIENT_ID || '';
    const apiUrl = process.env.QIKINK_API_URL || process.env.QIKINK_SANDBOX_BASE_URL || 'https://api.qikink.com';

    return NextResponse.json({
      success: true,
      ClientId: clientId,
      Accesstoken: token,
      access_token: token,
      apiUrl,
      expires_in: 3600,
    });
  } catch (error: any) {
    console.error('Qikink Auth API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
