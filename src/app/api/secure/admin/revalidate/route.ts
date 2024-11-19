import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { ResponseWithNoData } from '@/types';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

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
      log.warn(LOGGER_ERROR_MESSAGES.notAuthenticated, { authError, user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthenticated,
        },

        { status: 401 }
      );
    }

    const callerRole = await getUserRoleFromSession(supabase);
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(callerRole);

    if (!isAdmin && !isManager && !isOwner) {
      log.warn(LOGGER_ERROR_MESSAGES.notAuthorized, { userId: authUser.id, callerRole });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthorized,
        },

        { status: 401 }
      );
    }

    revalidatePath('/', 'layout');

    log.info('Revalidation successful', { userId: authUser.id, callerRole });

    return NextResponse.json({ success: true, message: 'Revalidation successful' });
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
