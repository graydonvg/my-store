import { NextResponse } from 'next/server';
import { CustomResponse, UpdateOrderAdminDb } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getNumberOfFormFields } from '@/utils/checkForms';
import { getUserRoleBoolean, getUserRoleFromSession } from '@/utils/getUserRole';

async function handlePost(request: AxiomRequest): Promise<NextResponse<CustomResponse>> {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const callerRole = await getUserRoleFromSession(supabase);
    const orderData: UpdateOrderAdminDb = await request.json();

    const { orderId, orderStatus, recipientFirstName, recipientLastName, recipientContactNumber, city, province } =
      orderData;
    const orderDetails = { orderStatus };
    const shippingDetails = {
      recipientFirstName,
      recipientLastName,
      recipientContactNumber,
      city,
      province,
    };

    const numberOfOrderDetailsFields = getNumberOfFormFields(orderDetails);
    const numberOfShippingDetailsFields = getNumberOfFormFields(shippingDetails);
    const hasOrderDataToUpdate = numberOfOrderDetailsFields > 0;
    const hasShippingDataToUpdate = numberOfShippingDetailsFields > 0;
    const { isAdmin, isManager, isOwner } = getUserRoleBoolean(callerRole);

    const failedMessage = 'Failed to update order';
    const successMessage = 'Order updated successfully.';

    request.log.info('Attempt: Update order.', {
      callerId: authUser?.id,
      callerRole,
      callerEmail: authUser?.email,
      payload: orderData,
    });

    if (!authUser) {
      const message = `${failedMessage}. Not authenticated.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!isAdmin && !isManager && !isOwner) {
      const message = `${failedMessage}. Not authorized.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!orderData || !(hasShippingDataToUpdate || hasOrderDataToUpdate)) {
      const message = `${failedMessage}. No data received.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (!orderId) {
      const message = `${failedMessage}. Please provide a valid order ID.`;

      request.log.error(message);

      return NextResponse.json({
        success: false,
        message,
      });
    }

    if (hasOrderDataToUpdate) {
      const { error: updateUserError } = await supabase.from('orders').update(orderDetails).eq('orderId', orderId);

      if (updateUserError) {
        const message = `${failedMessage}. Database error.`;

        request.log.error(message, updateUserError);

        return NextResponse.json({
          success: false,
          message: `${message} ${updateUserError.message}.`,
        });
      }
    }

    if (hasShippingDataToUpdate) {
      const { error: insertUserRoleError } = await supabase
        .from('shippingDetails')
        .update(shippingDetails)
        .eq('orderId', orderId);

      if (insertUserRoleError) {
        const message = 'Failed to update user role. Database error.';

        request.log.error(message, insertUserRoleError);

        return NextResponse.json({
          success: false,
          message: `${message} ${insertUserRoleError.message}.`,
        });
      }
    }

    request.log.info(successMessage);

    return NextResponse.json({ success: true, message: successMessage });
  } catch (error) {
    const failedMessage = 'Failed to update order';

    request.log.error(`${failedMessage}.`, { error: error as Error });

    return NextResponse.json({ success: false, message: `${failedMessage}. An unexpected error occurred.` });
  }
}

export const POST = withAxiom(handlePost);
