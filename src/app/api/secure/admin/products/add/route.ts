import { NextResponse } from 'next/server';
import { AddProduct, AddProductSchema, ResponseWithNoData } from '@/types';

import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to add product');

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

    log = request.log.with({ callerUserId: authUser.id });

    const isAuthorized = await checkAuthorizationServer(supabase, 'products.insert');

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

    let dataToAdd: AddProduct;

    try {
      dataToAdd = await request.json();
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

    const validation = AddProductSchema.safeParse(dataToAdd);

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

    const { data: insertedProductData, error: insertProductError } = await supabase
      .from('products')
      .insert(productData)
      .select('productId');

    if (insertProductError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseInsert, { error: insertProductError });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to add product. ${insertProductError.message}.`,
        },
        { status: 500 }
      );
    }

    const productId = insertedProductData[0].productId;

    const imageDataWithProductId = imageData.map((data) => ({ ...data, productId }));

    const { error: insertProductImageDataError } = await supabase
      .from('productImageData')
      .insert(imageDataWithProductId);

    if (insertProductImageDataError) {
      const { error: deleteProductError } = await supabase.from('products').delete().eq('productId', productId);

      if (deleteProductError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseDelete, { error: deleteProductError });
      }

      return NextResponse.json(
        {
          success: false,
          message: `Failed to add product image data. ${insertProductImageDataError.message}.`,
        },
        { status: 500 }
      );
    }

    revalidatePath('/', 'layout');

    const successMessage = 'Product added successfully';

    log.info(successMessage, { payload: dataToAdd });

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
