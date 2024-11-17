import { NextResponse } from 'next/server';
import { CreateUser, ResponseWithNoData, CreateUserSchema } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyObjectKeys } from '@/utils/objectHelpers';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { CONSTANTS } from '@/constants';
import { constructZodErrorMessage } from '@/utils/constructZodError';

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const supabaseService = createSupabaseService();
  let log = request.log;

  log.info('Attempting to create user');

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

    let userData: CreateUser;

    try {
      userData = await request.json();
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

    const validation = CreateUserSchema.safeParse(userData);

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

    const { email, password, ...userDataToUpdate } = validation.data;
    const { role: roleToAssign, ...restOfUserDataToUpdate } = userDataToUpdate;

    if (
      (roleToAssign === 'owner' && !isOwner) ||
      (roleToAssign === 'manager' && !isOwner) ||
      (roleToAssign === 'admin' && !(isOwner || isManager))
    ) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole, roleToAssign });

      return NextResponse.json(
        {
          success: false,
          message: `Not authorized to assign role '${roleToAssign}'.`,
        },
        { status: 401 }
      );
    }

    const { data: createUserData, error: createUserError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createUserError) {
      log.error('Database create user error', { error: createUserError });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to create user. ${createUserError.message}.`,
        },
        { status: 500 }
      );
    }

    const emptyFormFields = getEmptyObjectKeys(restOfUserDataToUpdate);
    const numberOfFormFields = getObjectKeyCount(restOfUserDataToUpdate);
    const hasDataToUpdate = emptyFormFields.length !== numberOfFormFields;

    if (hasDataToUpdate) {
      // Using supabaseService since anyone can sign up
      const { error: updateError } = await supabaseService
        .from('users')
        .update(restOfUserDataToUpdate)
        .eq('userId', createUserData.user.id);

      if (updateError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateError });

        return NextResponse.json(
          {
            success: false,
            message: `User created successfully, but failed to update users table entry. ${updateError.message}.`,
          },
          { status: 500 }
        );
      }

      if (roleToAssign) {
        // Not using supabaseService since not everyone can assign roles
        const { error: insertUserRoleError } = await supabase
          .from('userRoles')
          .insert({ userId: createUserData.user.id, role: roleToAssign });

        if (insertUserRoleError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertUserRoleError });

          return NextResponse.json(
            {
              success: false,
              message: `User created successfully, but failed to assign user role. ${insertUserRoleError.message}.`,
            },
            { status: 500 }
          );
        }
      }
    }

    const successMessage = 'User created successfully';

    log.info(successMessage, {
      data: {
        userId: createUserData.user.id,
        email,
        userDataToUpdate,
      },
    });

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
