import { NextResponse } from 'next/server';
import { CustomResponse, InsertProductImageDataStore, UpdateProduct } from '@/types';
import { ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request): Promise<NextResponse<CustomResponse>> {
  const supabase = await createSupabaseServerClient();

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const dataToUpdate: UpdateProduct = await request.json();

    const { productData, imageData } = dataToUpdate;

    if (!authUser)
      return NextResponse.json({
        success: false,
        message: `Failed to update product. ${ERROR_MESSAGES.NOT_AUTHENTICATED}`,
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

    const { error: updateProductError } = await supabase
      .from('products')
      .update(productData)
      .eq('productId', productData.productId!);

    if (updateProductError) {
      return NextResponse.json({ success: false, message: `Failed to update product. ${updateProductError.message}.` });
    }

    let imageDataToUpdate: InsertProductImageDataStore[] = [];
    const newImageData = imageData.filter((data) => !data.productImageId);

    if (newImageData.length > 0) {
      const newImageDataWithProductId = newImageData.map((data) => {
        const { productImageId, ...restOfData } = data;
        return { ...restOfData, productId: productData.productId! };
      });

      const { data, error: addImageDataError } = await supabase
        .from('productImageData')
        .insert(newImageDataWithProductId)
        .select('*');

      if (addImageDataError) {
        return NextResponse.json({
          success: false,
          message: `Failed to add image data to database. ${addImageDataError.message}.`,
        });
      }

      const addImageResponseData = data.map((item) => {
        return {
          fileName: item.fileName,
          productImageId: item.productImageId,
        };
      });

      imageDataToUpdate = imageData.map((item) => {
        const newImageData = addImageResponseData.find((responseData) => responseData.fileName === item.fileName);

        if (newImageData) {
          return {
            ...item,
            productImageId: newImageData.productImageId,
          };
        } else {
          return item;
        }
      });
    }

    // No need to update indexes if all images were deleted and replaced. If so, there will be no imageIds.
    const hasImageDataToUpdate = imageDataToUpdate.find((data) => data.productImageId);

    if (hasImageDataToUpdate) {
      const updatePromises = imageDataToUpdate.map((data) =>
        supabase.from('productImageData').update(data).eq('productImageId', data.productImageId!)
      );

      const [{ error: updateImageDataError }] = await Promise.all(updatePromises);

      if (updateImageDataError) {
        return NextResponse.json({
          success: false,
          message: `Failed to update image data. ${updateImageDataError.message}.`,
        });
      }
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update product. An unexpect error occured.' });
  }
}
