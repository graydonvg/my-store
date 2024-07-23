import { NextResponse } from 'next/server';
import {
  UserAuthData,
  CreateUser,
  UserAuthDataSchema,
  UpdateUserDataSchema,
  UserRoleSchema,
  ResponseWithNoData,
} from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getEmptyObjectKeys } from '@/utils/checkObject';
import { getObjectKeyCount } from '@/utils/checkObject';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';
import { CONSTANTS } from '@/constants';
import { constructZodErrorMessage } from '@/utils/construct';

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

    let userData: UserAuthData & CreateUser;

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

    const { email, password, ...userDataToUpdate } = userData;
    const { role: roleToAssign, ...restOfUserDataToUpdate } = userDataToUpdate;

    const userAuthValidation = UserAuthDataSchema.safeParse({ email, password });

    if (!userAuthValidation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: userAuthValidation.error });

      const errorMessage = constructZodErrorMessage(userAuthValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const userDataValidation = UpdateUserDataSchema.safeParse(restOfUserDataToUpdate);

    if (!userDataValidation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: userDataValidation.error });

      const errorMessage = constructZodErrorMessage(userDataValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const userRoleValidation = UserRoleSchema.safeParse(roleToAssign);

    if (!userRoleValidation.success) {
      log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error: userRoleValidation.error });

      const errorMessage = constructZodErrorMessage(userRoleValidation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    if (
      (userRoleValidation.data === 'owner' && !isOwner) ||
      (userRoleValidation.data === 'manager' && !isOwner) ||
      (userRoleValidation.data === 'admin' && !(isOwner || isManager))
    ) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHORIZED, { userRole, roleToAssign: userRoleValidation.data });

      return NextResponse.json(
        {
          success: false,
          message: `Not authorized to assign role '${userRoleValidation.data}'.`,
        },
        { status: 401 }
      );
    }

    const { data: createUserData, error: createUserError } = await supabaseService.auth.admin.createUser({
      ...userAuthValidation.data,
      email_confirm: true,
    });

    if (createUserError) {
      log.error('Database create user error', { error: createUserError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to create user. Please try again later.',
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
        .update(userDataValidation.data)
        .eq('userId', createUserData.user.id);

      if (updateError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_UPDATE, { error: updateError });

        return NextResponse.json(
          {
            success: false,
            message: 'User created successfully, but failed to update users table entry.',
          },
          { status: 500 }
        );
      }

      if (userRoleValidation.data) {
        // Not using supabaseService since not everyone can assign roles
        const { error: insertUserRoleError } = await supabase
          .from('userRoles')
          .insert({ userId: createUserData.user.id, role: userRoleValidation.data });

        if (insertUserRoleError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertUserRoleError });

          return NextResponse.json(
            {
              success: false,
              message: 'User created successfully, but failed to assign user role.',
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
        ...userDataValidation.data,
        role: roleToAssign,
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
