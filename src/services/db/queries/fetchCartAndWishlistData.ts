import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchCartAndWishlistData() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchCartAndWishlistData' });
  logger.info('Attempting to fetch user cart and wishlist data');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('users')
      .select(
        'wishlist(productId, size), cart(createdAt, cartItemId, quantity, size, product: products(name, isOnSale, price, salePercentage, deliveryInfo, returnInfo, productId, sizes, brand, category, productImageData(imageUrl, imageIndex)))'
      )
      .eq('userId', authUser?.id ?? '')
      .eq('cart.products.productImageData.imageIndex', 0)
      .order('createdAt', { ascending: true, referencedTable: 'cart' });

    if (error) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });
      return {
        cartItems: null,
        wishlistData: null,
      };
    }

    const { cart, wishlist } = data[0];

    logger.info('Fetched user cart and wishlist data successfully');

    return {
      cartItems: cart,
      wishlistData: wishlist,
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      cartItems: null,
      wishlistData: null,
    };
  } finally {
    await logger.flush();
  }
}
