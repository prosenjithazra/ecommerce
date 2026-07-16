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

    return NextResponse.json({
      success: true,
      access_token: token,
    });
  } catch (error: any) {
    console.error('Qikink Auth API Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
