import { NextResponse } from 'next/server';

import { CustomResponseType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { noDataReceivedError, notAuthenticatedError } from '@/constants/api';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const personalData: { firstName: string; lastName: string } = await request.json();

    if (!session)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${notAuthenticatedError}`,
      });

    if (!personalData)
      return NextResponse.json({
        success: false,
        message: `Failed to update personal information. ${noDataReceivedError}`,
      });

    const { error } = await supabase.from('users').update(personalData).eq('userId', session.user.id);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to update personal information. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Personal information updated successfully.' });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to update personal information. An unexpect error occured.',
    });
  }
}
