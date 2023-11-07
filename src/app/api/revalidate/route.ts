import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get('path');
    const secret = request.nextUrl.searchParams.get('secret');

    if (secret !== process.env.NEXT_PUBLIC_ON_DEMAND_REVALIDATION_SECRET_TOKEN) {
      return NextResponse.json({ success: false, message: 'Revalidation failed. Invalid token' });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ success: true, message: 'Revalidation successful' });
    }

    return NextResponse.json({
      success: false,
      message: 'Missing path to revalidate',
    });
  } catch (error) {
    throw error;
  }
}
