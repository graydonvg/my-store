import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateProduct, UpdateProductSchema } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';
import { constructZodErrorMessage } from '@/utils/construct';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update product');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.AUTHENTICATION,
        },
        { status: 500 }
      );
    }

    if (!authUser) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED, { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
        },
        { status: 401 }
      );
    }

    log = request.log.with({ userId: authUser.id });

    const userRole = await getUserRoleFromSession(supabase);
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(userRole);

    if (!isAdmin && !isManager && !isOwner) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },
        { status: 401 }
      );
    }

    let dataToUpdate: UpdateProduct;

    try {
      dataToUpdate = await request.json();
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },
        { status: 400 }
      );
    }

    const validation = UpdateProductSchema.safeParse(dataToUpdate);

    if (!validation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { productData, imageData } = validation.data;

    const { error: updateProductDataError } = await supabase
      .from('products')
      .update(productData)
      .eq('productId', productData.productId);

    if (updateProductDataError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateProductDataError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update product. Please try again later.',
        },
        { status: 500 }
      );
    }

    let shouldUpdateImageData = true;
    let imageDataToUpdate = imageData;

    const newImageData = imageData.filter((data) => !data.productImageId);

    if (newImageData.length > 0) {
      const newImageDataWithProductId = newImageData.map((data) => {
        const { productImageId, ...restOfData } = data;

        return { ...restOfData, productId: productData.productId! };
      });

      const { data: insertImageDataResponse, error: insertImageDataError } = await supabase
        .from('productImageData')
        .insert(newImageDataWithProductId)
        .select('*');

      if (insertImageDataError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertImageDataError });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to add image data to database. Please try again later.',
          },
          { status: 500 }
        );
      }

      if (insertImageDataResponse.length === imageData.length) {
        // If all images were replaced, all indexes will be correct and no further updates are required.
        // If only some images were replaced and/or images were rearranged, the image indexes will need to be updated below.
        shouldUpdateImageData = false;
      }

      // Add the productImageId (obtained after inserting the new data) to the imageData sent in the request body
      imageDataToUpdate = imageData.map((item) => {
        const newImageData = insertImageDataResponse.find((responseData) => responseData.fileName === item.fileName);

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

    if (shouldUpdateImageData) {
      const updatePromises = imageDataToUpdate.map((data) =>
        supabase.from('productImageData').update(data).eq('productImageId', data.productImageId!)
      );

      const updatePromiseResults = await Promise.all(updatePromises);

      if (updatePromiseResults.some((result) => result.error) || updatePromiseResults.length === 0) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { promiseResults: updatePromiseResults });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to update image data. Please try again later.',
          },
          { status: 500 }
        );
      }
    }

    revalidatePath('/', 'layout');

    const successMessage = 'Product updated successfully';

    log.info(successMessage, { payload: dataToUpdate });

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return NextResponse.json(
      {
        success: false,
        message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
