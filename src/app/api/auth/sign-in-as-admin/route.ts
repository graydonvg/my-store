import { NextResponse } from 'next/server';
import { ResponseWithNoData } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseService from '@/lib/supabase/supabase-service';

function generateUniqueEmailAddress(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueString = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    uniqueString += chars[randomIndex];
  }

  return `admin${uniqueString}@user.com`;
}

export const POST = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  const supabaseService = createSupabaseService();
  let log = request.log;

  log.info('Attempting to sign in as admin');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      log.warn('A user session already exists', { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: 'Unable to sign in. Please try again later.',
        },
        { status: 409 }
      );
    }

    const uniqueEmailAddress = generateUniqueEmailAddress();
    const password = '123456';

    const { data: signUpResponse, error: signUpError } = await supabase.auth.signUp({
      email: uniqueEmailAddress,
      password,
    });

    if (signUpError) {
      log.error('Sign up error', { error: signUpError });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to sign in. Please try again later',
        },
        { status: 500 }
      );
    }

    const userId = signUpResponse?.user?.id ?? '';

    const { error: updateError } = await supabase
      .from('users')
      .update({
        firstName: 'Admin',
        lastName: 'User',
        contactNumber: '0721234567',
        createdBy: userId,
      })
      .eq('userId', userId);

    if (updateError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseUpdate, { error: updateError });

      return NextResponse.json(
        {
          success: false,
          message: 'Sign in successful, but failed to insert name and contact number.',
        },
        { status: 500 }
      );
    }

    const { error: insertUserRoleError } = await supabaseService.from('userRoles').insert({ userId, role: 'admin' });

    if (insertUserRoleError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseInsert, { error: insertUserRoleError });

      return NextResponse.json(
        {
          success: false,
          message: 'Sign in successful, but failed to assign user role.',
        },
        { status: 500 }
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: uniqueEmailAddress,
      password,
    });

    if (signInError) {
      log.error('Failed to sign in after signing up new admin user', { error: insertUserRoleError });
    }

    const { data: insertedProductData, error: insertProductError } = await supabase
      .from('products')
      .insert({
        category: 'Women',
        name: 'Demo product',
        brand: 'DemoProducts',
        details: 'This is a demo product, Can be edited, Can be deleted',
        price: 1,
        salePercentage: 0,
        isOnSale: false,
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        deliveryInfo: 'FREE delivery on orders over R500',
        returnInfo: 'Free exchange or return within 30 days',
        filterColors: ['white'],
        filterMaterials: ['wool blend'],
        createdBy: userId,
      })
      .select('productId');

    if (insertProductError) {
      log.error('Failed to add demo product', { error: insertProductError });
    }

    if (insertedProductData) {
      const productId = insertedProductData[0].productId;

      const { error: insertProductImageDataError } = await supabase.from('productImageData').insert({
        productId,
        fileName: 'demo-product-image.jpg',
        imageUrl:
          'https://glsavotvghmcohmwhmxw.supabase.co/storage/v1/object/public/product-images/demo-product-image.jpg',
        imageIndex: 0,
        createdBy: userId,
      });

      if (insertProductImageDataError) {
        const { error: deleteProductError } = await supabase.from('products').delete().eq('productId', productId);

        if (deleteProductError) {
          log.error('Failed to add demo product image data', { error: deleteProductError });
        }
      }
    }

    const successMessage = 'Signed in as admin successfully';

    log.info(successMessage, {
      data: {
        userId,
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
