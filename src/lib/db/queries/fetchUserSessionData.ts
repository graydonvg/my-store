import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { getUserRoleFromSession } from '@/utils/getUserRole';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchUserSessionData() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchUserSessionData' });
  logger.info('Fetching user session data');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      logger.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.NOT_AUTHENTICATED);
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
      .eq('cart.products.productImageData.index', 0)
      .order('createdAt', { ascending: true, referencedTable: 'cart' });

    if (userDataError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: userDataError });
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

    logger.info('Fetched user session data successfully');

    return {
      authUser,
      userData: { ...restOfUserData, isOAuthSignIn, role },
      cartItems: cart,
      wishlistData: wishlist,
    };
  } catch (error) {
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
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
