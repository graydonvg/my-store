import { LOGGER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchWishlist() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchWishlist' });
  logger.info('Attempting to fetch user wishlist');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data, error: wishlistError } = await supabase
      .from('wishlist')
      .select(
        'wishlistItemId, size, product: products(*, productImageData(fileName, imageUrl, productImageId, imageIndex))'
      )
      .eq('userId', authUser?.id ?? '')
      .order('createdAt', { ascending: true });

    if (wishlistError) {
      logger.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: wishlistError });
      return null;
    }

    const wishlist = data?.map((item) => {
      return {
        wishlistItemId: item.wishlistItemId,
        size: item.size,
        product: item.product!,
      };
    });

    logger.info('Fetched user wishlist successfully');

    return wishlist;
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
