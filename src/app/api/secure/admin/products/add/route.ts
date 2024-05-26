import { NextResponse } from 'next/server';
import { AddProduct, CustomResponse } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const dataToAdd: AddProduct = await request.json();

    const { productData, imageData } = dataToAdd;

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to add product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
      });

    if (!productData)
      return NextResponse.json({
        success: false,
        message: 'Failed to add product. No product data received',
      });

    if (!imageData)
      return NextResponse.json({
        success: false,
        message: 'Failed to add product. No image data data received',
      });

    const { data, error: addProductError } = await supabase.from('products').insert(productData).select('productId');

    if (addProductError) {
      return NextResponse.json({ success: false, message: `Failed to add product. ${addProductError.message}.` });
    }

    const productId = data[0].productId;

    const imageDataWithProductId = imageData.map((data) => {
      const { productImageId, ...restOfData } = data;
      return { ...restOfData, productId };
    });

    const { error: addProductImageDataError } = await supabase.from('productImageData').insert(imageDataWithProductId);

    if (addProductImageDataError) {
      const { error: deleteProductError } = await supabase.from('products').delete().eq('productId', productId);

      if (deleteProductError) {
        return NextResponse.json({
          success: false,
          message: `Failed to add image data to database. ${addProductImageDataError.message}. Failed to delete product. ${deleteProductError.message}.`,
        });
      }
      return NextResponse.json({
        success: false,
        message: `Failed to add image data to database. ${addProductImageDataError.message}.`,
      });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to add product. An unexpect error occured.' });
  }
}
