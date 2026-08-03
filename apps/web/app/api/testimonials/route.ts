import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://ecommerce-0f9b.onrender.com';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/testimonials`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.headers.get('authorization') || '';
  const res = await fetch(`${BACKEND}/testimonials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
