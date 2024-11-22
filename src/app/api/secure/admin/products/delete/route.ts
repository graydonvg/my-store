import { NextResponse } from 'next/server';
import { NumericIdSchema, ResponseWithNoData } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';

import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const DELETE = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to delete product(s)');

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

    const isAuthorized = await checkAuthorizationServer(supabase, 'products.delete');

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

    let productIdsArray: number[];

    try {
      productIdsArray = await request.json();
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

    const validation = NumericIdSchema.array().safeParse(productIdsArray);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const { data: productData, error: deleteProductError } = await supabase
      .from('products')
      .delete()
      .in('productId', validation.data)
      .select('productImageData(fileName)');

    const fileNames = productData?.[0]?.productImageData.map((item) => item.fileName);

    const { error: storageError } = fileNames?.length
      ? await supabase.storage.from('product-images').remove(fileNames)
      : { error: null };

    if (deleteProductError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseDelete, { error: deleteProductError });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete product(s). ${deleteProductError.message}.`,
        },
        { status: 500 }
      );
    }

    if (storageError) {
      log.error(LOGGER_ERROR_MESSAGES.storageDelete, { error: storageError });

      return NextResponse.json(
        {
          success: false,
          message: `Product(s) deleted, but failed to delete image(s) from storage. ${storageError.message}.`,
        },
        { status: 500 }
      );
    }

    const successMessage = `Product(s) deleted successfully`;

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete product data. ${USER_ERROR_MESSAGES.unexpected}`,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
