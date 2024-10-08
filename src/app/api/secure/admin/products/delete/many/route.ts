import { NextResponse } from 'next/server';
import { NumericIdSchema, ResponseWithNoData } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { CONSTANTS } from '@/constants';

export const DELETE = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to delete selected products');

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
    const { isManager, isOwner } = getUserRoleBoolean(userRole);

    if (!isManager && !isOwner) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },
        { status: 401 }
      );
    }

    let productIdsArray: string[];

    try {
      productIdsArray = await request.json();
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

    const validation = NumericIdSchema.array().safeParse(productIdsArray);

    if (!validation.success) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
        },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase.from('products').delete().in('productId', validation.data);

    if (deleteError) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_DELETE, { error: deleteError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to delete product(s). Please try again later.',
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
    log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete product data. ${CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED}`,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
