import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { ResponseWithNoData } from '@/types';

export const GET = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();

  const log = request.log.with({ path: '/', type: 'layout' });

  log.info('Attempting to revalidate all data');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED, { authError, user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHENTICATED,
        },

        { status: 401 }
      );
    }

    const callerRole = await getUserRoleFromSession(supabase);
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(callerRole);

    if (!isAdmin && !isManager && !isOwner) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userId: authUser.id, callerRole });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.NOT_AUTHORIZED,
        },

        { status: 401 }
      );
    }

    revalidatePath('/', 'layout');

    log.info('Revalidation successful', { userId: authUser.id, callerRole });

    return NextResponse.json({ success: true, message: 'Revalidation successful' });
  } catch (error) {
    log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.GENERAL, { error });

    return NextResponse.json(
      {
        success: false,
        message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL,
      },

      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
