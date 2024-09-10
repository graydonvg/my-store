import { NextResponse } from 'next/server';
import { InsertOrder, AddOrderResponse, InsertOrderSchema, ResponseWithData } from '@/types';
import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { AxiomRequest, withAxiom } from 'next-axiom';

export const POST = withAxiom(
  async (request: AxiomRequest): Promise<NextResponse<ResponseWithData<AddOrderResponse | null>>> => {
    const supabase = await createSupabaseServerClient();
    let log = request.log;

    log.info('Attempting to add order');

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
            data: null,
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
            data: null,
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
            message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
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
            data: null,
          },
          { status: 400 }
        );
      }

      const { data: orderId, error: addOrderError } = await supabase.rpc('addOrder', {
        order_items: validation.data.orderItems,
        shipping_details: validation.data.shippingDetails,
        order_details: validation.data.orderDetails,
      });

      if (addOrderError) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_INSERT, { error: addOrderError });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create order. Please try again later.',
            data: null,
          },
          { status: 500 }
        );
      }

      const successMessage = 'Order created successfully';

      log.info(successMessage, { orderId });

      return NextResponse.json(
        {
          success: true,
          message: successMessage,
          data: { orderId },
        },
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
