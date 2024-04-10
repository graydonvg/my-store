import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN) {
      return NextResponse.json({ success: false, message: 'Revalidation failed. Invalid token.' });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Revalidation successful' });
  } catch (error) {
    throw error;
  }
}
