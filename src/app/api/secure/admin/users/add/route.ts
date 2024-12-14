import { NextResponse } from 'next/server';
import { CreateUser, ResponseWithNoData, CreateUserSchema } from '@/types';
import createSupabaseService from '@/lib/supabase/supabase-service';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/auth';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

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

    let userData: CreateUser;

    try {
      userData = await request.json();
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

    const validation = CreateUserSchema.safeParse(userData);

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

    const { email, password, ...userDataToUpdate } = validation.data;
    const { role: roleToAssign, ...restOfUserDataToUpdate } = userDataToUpdate;

    const userRole = await getUserRoleFromSession(supabase);
    const { isManager, isOwner } = getUserRoleBoolean(userRole);

    let isAuthorizedToAssignRoles = false;

    if (roleToAssign) {
      isAuthorizedToAssignRoles = await checkAuthorizationServer(supabase, 'userRoles.insert');
    }

    if (
      roleToAssign &&
      (!isAuthorizedToAssignRoles ||
        (roleToAssign === 'owner' && !isOwner) ||
        (roleToAssign === 'manager' && !isOwner) ||
        (roleToAssign === 'admin' && !(isOwner || isManager)))
    ) {
      log.error(LOGGER_ERROR_MESSAGES.notAuthorized, { userRole, roleToAssign });

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

    // Using supabaseService since anyone can sign up
    const { error: updateError } = await supabaseService
      .from('users')
      .update({ ...restOfUserDataToUpdate, createdBy: authUser.id })
      .eq('userId', createUserData.user.id);

    if (updateError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateError });

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
        log.error(LOGGER_ERROR_MESSAGES.databaseInsert, { error: insertUserRoleError });

        return NextResponse.json(
          {
            success: false,
            message: `User created successfully, but failed to assign user role. ${insertUserRoleError.message}.`,
          },
          { status: 500 }
        );
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
