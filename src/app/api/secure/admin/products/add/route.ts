import { NextResponse } from 'next/server';
import { AddProduct, AddProductSchema, ResponseWithNoData } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { revalidatePath } from 'next/cache';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';

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

    log = request.log.with({ callerUserId: authUser.id });

    const userRole = await getUserRoleFromSession(supabase);

    const isAuthorized = await checkAuthorizationServer(supabase, 'products.insert');

    if (!isAuthorized) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },
        { status: 401 }
      );
    }

    let dataToAdd: AddProduct;

    try {
      dataToAdd = await request.json();
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

    const validation = AddProductSchema.safeParse(dataToAdd);

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

    const { data: insertedProductData, error: insertProductError } = await supabase
      .from('products')
      .insert(productData)
      .select('productId');

    if (insertProductError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertProductError });

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
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_DELETE, { error: deleteProductError });
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
