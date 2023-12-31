import { NextResponse } from 'next/server';
import { CustomResponseType, InsertAddressType } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';

export async function POST(request: Request): Promise<NextResponse<CustomResponseType>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const formData: InsertAddressType = await request.json();

  if (!session) return NextResponse.json({ success: false, message: 'Failed to add address. Please try again later.' });

  try {
    const { error } = await supabase.from('addresses').insert(formData);

    if (error) {
      return NextResponse.json({ success: false, message: `Failed to add address. ${error.message}.` });
    }

    return NextResponse.json({ success: true, message: 'Address added successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add address. An unexpect error occured.' });
  }
}
