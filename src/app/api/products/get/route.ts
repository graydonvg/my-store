import { serverClientForRoute } from '@/lib/supabase-route';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await serverClientForRoute();

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, product_image_data(file_name, image_url)');

    if (error) {
      return NextResponse.json({ code: error.code, message: error.message });
    }

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ code: 500, message: 'An unexpect error occured' });
  }
}
