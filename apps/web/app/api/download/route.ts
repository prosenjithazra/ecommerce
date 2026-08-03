import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'download.png';

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // 1. If base64 data URL, decode and stream directly
    if (url.startsWith('data:')) {
      const matches = url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2]!, 'base64');
        const headers = new Headers();
        headers.set('Content-Type', mimeType || 'image/png');
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        return new NextResponse(buffer, { status: 200, headers });
      }
    }

    // 2. Proxy external remote HTTP/HTTPS URLs (Cloudinary, S3, API)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch file from server: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set('Content-Type', response.headers.get('Content-Type') || 'image/png');
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Cache-Control', 'no-cache');

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Download Proxy Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to download file' }, { status: 500 });
  }
}
