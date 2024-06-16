import { NextResponse } from 'next/server';

import { ResponseWithNoData } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { log, withAxiom } from 'next-axiom';
import { CONSTANTS } from '@/constants';

export const GET = withAxiom(async (): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();

  log.info('Attempting to sign out user');

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
      log.warn('No user session exists', { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to sign out. Please try again later.',
        },
        { status: 401 }
      );
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      log.error('Sign out error', { error });

      return NextResponse.json(
        {
          success: false,
          message: `Sign out failed. ${error.message}.`,
        },
        { status: 500 }
      );
    }

    const successMessage = 'Sign out successful';

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
        message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
