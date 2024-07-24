import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Logger } from 'next-axiom';

const log = new Logger();

export default async function fetchWishlist() {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchWishlist' });
  logger.info('Fetching user wishlist');

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const { data, error: wishlistError } = await supabase
      .from('wishlist')
      .select('wishlistItemId, size, product: products(*, productImageData(fileName, imageUrl, productImageId, index))')
      .eq('userId', authUser?.id ?? '')
      .order('createdAt', { ascending: true });

    if (wishlistError) {
      logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error: wishlistError });
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
    logger.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });
    return null;
  } finally {
    await logger.flush();
  }
}
