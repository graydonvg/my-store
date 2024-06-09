import { NextResponse } from 'next/server';
import { InsertOrderDb, AddOrderResponse, CustomResponse } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { InsertOrderSchema } from '@/schemas/orderSchema';

export const POST = withAxiom(
  async (request: AxiomRequest): Promise<NextResponse<CustomResponse<AddOrderResponse | null>>> => {
    const supabase = await createSupabaseServerClient();
    const log = request.log;

    log.info('Attempting to add order');

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
            data: null,
          },

          { status: 401 }
        );
      }

      let orderData: InsertOrderDb;

      try {
        orderData = await request.json();
      } catch (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.NO_DATA_RECEIVED,
            data: null,
          },

          { status: 400 }
        );
      }

      try {
        InsertOrderSchema.parse(orderData);
      } catch (error) {
        log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { error, orderData });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.GENERAL_VALIDATION,
            data: null,
          },

          { status: 400 }
        );
      }

      const { error: insertOrderError, data: insertOrderResponseData } = await supabase
        .from('orders')
        .insert({ ...orderData.orderDetails })
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

      const orderItemsWithOrderId = orderData.orderItems.map((item) => {
        return {
          ...item,
          orderId: orderId,
        };
      });

      const insertOrderItemsPromise = supabase.from('orderItems').insert(orderItemsWithOrderId);

      const insertShippingDetailsPromise = supabase
        .from('shippingDetails')
        .insert({ ...orderData.shippingDetails, orderId: orderId });

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

          return NextResponse.json({
            success: false,
            message: 'Failed to add order items. Please try again later.',
            data: null,
          });
        } else if (insertShippingDetailsResponse.error) {
          log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, {
            error: insertShippingDetailsResponse,
          });

          return NextResponse.json({
            success: false,
            message: 'Failed to add shipping details. Please try again later.',
            data: null,
          });
        }
      }

      log.info('Order created successfully', { orderId });

      return NextResponse.json(
        { success: true, message: 'Order created successfully', data: { orderId } },
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
