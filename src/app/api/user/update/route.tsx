import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database } from '@/lib/database.types';

// export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const formData = await request.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });

  try {
    const { error } = await supabase
      .from('users')
      .update({ ...formData })
      .eq('id', formData.id);

    if (error) {
      return NextResponse.json({ status: error.code, statusText: error.message });
    }

    return NextResponse.json({ status: 200, statusText: 'Update user successful' });
  } catch (error) {
    return NextResponse.json({ status: 500, statusText: 'An unexpected error occurred.' });
  }
}
