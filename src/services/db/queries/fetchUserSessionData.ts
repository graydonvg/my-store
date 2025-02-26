import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleFromSession } from '@/utils/auth';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchUserSessionData() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchUserSessionData' });
  logger.info('Attempting to fetch user session data');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return {
        authUser: null,
        userData: null,
        cartItems: null,
        wishlistData: null,
      };
    }

    const role = await getUserRoleFromSession(supabase);

    const { data: userDataArray, error: userDataError } = await supabase
      .from('users')
      .select(
        '*, wishlist( productId, size), cart(createdAt, cartItemId, quantity, size, product: products(productId, name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, sizes, brand, category, productImageData(imageUrl)))'
      )
      .eq('userId', authUser?.id ?? '')
      .eq('cart.products.productImageData.imageIndex', 0)
      .order('createdAt', { ascending: true, referencedTable: 'cart' });

    if (userDataError) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: userDataError });
      return {
        authUser,
        userData: null,
        cartItems: null,
        wishlistData: null,
      };
    }

    if (!userDataArray || !userDataArray[0]) {
      logger.warn('No user data received');
      return {
        authUser,
        userData: null,
        cartItems: null,
        wishlistData: null,
      };
    }

    const { cart, wishlist, ...restOfUserData } = userDataArray[0];

    const isOAuthSignIn = authUser?.app_metadata.provider !== 'email';
    const oAuthName = authUser.user_metadata.name;

    logger.info('Fetched user session data successfully');

    return {
      authUser,
      userData: { ...restOfUserData, isOAuthSignIn, oAuthName: oAuthName || null, role },
      cartItems: cart,
      wishlistData: wishlist,
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      authUser: null,
      userData: null,
      cartItems: null,
      wishlistData: null,
    };
  } finally {
    await logger.flush();
  }
}
