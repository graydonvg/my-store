import { NextResponse } from 'next/server';
import { ResponseWithNoData, UpdateOrder, UpdateOrderSchema } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getObjectKeyCount } from '@/utils/objectHelpers';
import { getUserRoleFromSession } from '@/utils/auth';
import { AxiomRequest, withAxiom } from 'next-axiom';

import { constructZodErrorMessage } from '@/utils/constructZodError';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const PUT = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to update order');

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

    const isAuthorized = await checkAuthorizationServer(supabase, 'orders.update');

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

    let orderData: UpdateOrder;

    try {
      orderData = await request.json();
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

    const validation = UpdateOrderSchema.safeParse(orderData);

    if (!validation.success) {
      log.warn(LOGGER_ERROR_MESSAGES.validation, { payload: orderData, error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
        },
        { status: 400 }
      );
    }

    const { orderId, orderStatus, ...shippingDetails } = validation.data;
    const orderDetails = { orderStatus };

    const orderDetailsObjectKeyCount = getObjectKeyCount(orderDetails);
    const shippingDetailsObjectKeyCount = getObjectKeyCount(shippingDetails);

    const hasOrderDataToUpdate = orderDetailsObjectKeyCount > 0;
    const hasShippingDataToUpdate = shippingDetailsObjectKeyCount > 0;

    if (hasOrderDataToUpdate) {
      const { error: ordersUpdateError } = await supabase.from('orders').update(orderDetails).eq('orderId', orderId);

      if (ordersUpdateError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: ordersUpdateError });

        return NextResponse.json(
          {
            success: false,
            message: `Failed to update order. ${ordersUpdateError.message}.`,
          },
          { status: 500 }
        );
      }
    }

    if (hasShippingDataToUpdate) {
      const { error: shippingDetailsUpdateError } = await supabase
        .from('shippingDetails')
        .update(shippingDetails)
        .eq('orderId', orderId);

      if (shippingDetailsUpdateError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: shippingDetailsUpdateError });

        return NextResponse.json(
          {
            success: false,
            message: `Failed to update shipping details. ${shippingDetailsUpdateError.message}.`,
          },
          { status: 500 }
        );
      }
    }

    const successMessage = 'Order updated successfully';

    log.info(successMessage, { payload: orderData });

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
