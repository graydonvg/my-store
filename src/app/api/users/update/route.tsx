import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';
import { CustomResponseType } from '@/types';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const formData = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ statusCode: 401, message: 'Unauthorized. Please sign in' });

  try {
    const { error } = await supabase
      .from('users')
      .update({ ...formData })
      .eq('user_id', session.user.id);

    if (error) {
      return NextResponse.json({ statusCode: error.code, message: error.message });
    }

    return NextResponse.json({ statusCode: 200, message: 'Update user successful' });
  } catch (error) {
    return NextResponse.json({ statusCode: 500, message: 'An unexpected error occurred' });
  }
}
