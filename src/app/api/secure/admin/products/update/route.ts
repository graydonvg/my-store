import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateProduct, UpdateProductSchema } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

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
      log.error(LOGGER_ERROR_MESSAGES.authentication, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.authentication,
        },
        { status: 500 }
      );
    }

    if (!authUser) {
      log.warn(LOGGER_ERROR_MESSAGES.notAuthenticated, { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthenticated,
        },
        { status: 401 }
      );
    }

    log = request.log.with({ userId: authUser.id });

    const isAuthorized = await checkAuthorizationServer(supabase, 'products.update');

    if (!isAuthorized) {
      const userRole = await getUserRoleFromSession(supabase);
      log.warn(LOGGER_ERROR_MESSAGES.notAuthorized, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthorized,
        },
        { status: 401 }
      );
    }

    let dataToUpdate: UpdateProduct;

    try {
      dataToUpdate = await request.json();
    } catch (error) {
      log.error(LOGGER_ERROR_MESSAGES.parse, { error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const validation = UpdateProductSchema.safeParse(dataToUpdate);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { error: validation.error });

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

    const newImageData = imageData.filter((data) => !data.productImageId);

    if (newImageData.length) {
      const { error: updateProductError } = await supabase.rpc('updateProductWithImages', {
        product_data: productData,
        image_data: imageData,
      });

      if (updateProductError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateProductError });

        return NextResponse.json(
          {
            success: false,
            message: `Failed to update product. ${updateProductError.message}.`,
          },
          { status: 500 }
        );
      }
    } else {
      const { error: updateProductDataError } = await supabase
        .from('products')
        .update(productData)
        .eq('productId', productData.productId);

      if (updateProductDataError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateProductDataError });

        return NextResponse.json(
          {
            success: false,
            message: `Failed to update product. ${updateProductDataError.message}.`,
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
    log.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return NextResponse.json(
      {
        success: false,
        message: USER_ERROR_MESSAGES.unexpected,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
