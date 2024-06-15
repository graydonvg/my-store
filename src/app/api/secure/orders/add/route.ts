import { NextResponse } from 'next/server';
import { InsertOrder, AddOrderResponse, CustomResponse, InsertOrderSchema } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';

export const POST = withAxiom(
  async (request: AxiomRequest): Promise<NextResponse<CustomResponse<AddOrderResponse | null>>> => {
    const supabase = await createSupabaseServerClient();
    let log = request.log;
    const successMessage = 'Order created successfully';

    log.info('Attempting to add order');

    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.AUTHENTICATION, { error: authError });

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

      let orderData: InsertOrder;

      try {
        orderData = await request.json();
      } catch (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.NO_DATA,
            data: null,
          },
          { status: 400 }
        );
      }

      const validation = InsertOrderSchema.safeParse(orderData);

      if (!validation.success) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { payload: orderData, error: validation.error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
          },
          { status: 400 }
        );
      }

      const { error: insertOrderError, data: insertOrderResponseData } = await supabase
        .from('orders')
        .insert({ ...validation.data.orderDetails })
        .select('orderId');

      if (insertOrderError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: insertOrderError });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create order. Please try again later.',
            data: null,
          },
          { status: 500 }
        );
      }

      const { orderId } = insertOrderResponseData[0];

      const orderItemsWithOrderId = validation.data.orderItems.map((item) => {
        return {
          ...item,
          orderId: orderId,
        };
      });

      const insertOrderItemsPromise = supabase.from('orderItems').insert(orderItemsWithOrderId);

      const insertShippingDetailsPromise = supabase
        .from('shippingDetails')
        .insert({ ...validation.data.shippingDetails, orderId: orderId });

      const [insertOrderItemsResponse, insertShippingDetailsResponse] = await Promise.all([
        insertOrderItemsPromise,
        insertShippingDetailsPromise,
      ]);

      if (insertOrderItemsResponse.error || insertShippingDetailsResponse.error) {
        const { error: deleteOrderError } = await supabase.from('orders').delete().eq('orderId', orderId);

        if (deleteOrderError) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_DELETE, { error: deleteOrderError });
        }

        if (insertOrderItemsResponse.error && insertShippingDetailsResponse.error) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, {
            orderItemsError: insertOrderItemsResponse,
            shippingDetailsError: insertShippingDetailsResponse,
          });

          return NextResponse.json(
            {
              success: false,
              message: 'Failed to add order items and shipping details. Please try again later.',
              data: null,
            },
            { status: 500 }
          );
        } else if (insertOrderItemsResponse.error) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, {
            error: insertOrderItemsResponse,
          });

          return NextResponse.json(
            {
              success: false,
              message: 'Failed to add order items. Please try again later.',
              data: null,
            },
            { status: 500 }
          );
        } else if (insertShippingDetailsResponse.error) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, {
            error: insertShippingDetailsResponse,
          });

          return NextResponse.json(
            {
              success: false,
              message: 'Failed to add shipping details. Please try again later.',
              data: null,
            },
            { status: 500 }
          );
        }
      }

      log.info(successMessage, { orderId });

      return NextResponse.json(
        { success: true, message: successMessage, data: { orderId } },
        {
          status: 201,
        }
      );
    } catch (error) {
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
          data: null,
        },
        { status: 500 }
      );
    } finally {
      await log.flush();
    }
  }
);
