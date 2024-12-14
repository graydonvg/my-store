import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Product, ResponseWithData } from '@/types';
import { Logger } from 'next-axiom';

const log = new Logger();

export async function fetchHomePageProductsDynamic(): Promise<
  ResponseWithData<{ limitedLatestProducts: Product[] | null; limitedOnSaleProducts: Product[] | null } | null>
> {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchHomePageProductsDynamic' });
  logger.info('Attempting to fetch home page products');

  try {
    const { data: limitedOnSaleProducts, error: limitedOnSaleError } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('isOnSale', true)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('salePercentage', { ascending: false })
      .limit(3);

    const limitedOnSaleProductIds = limitedOnSaleProducts?.map((product) => product.productId);

    const { data: limitedLatestProducts, error: limitedLatestError } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .not('productId', 'in', `(${limitedOnSaleProductIds})`)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('createdAt', { ascending: false })
      .limit(3);

    if (limitedLatestError && limitedOnSaleError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedLatestError });

      return {
        success: false,
        message: 'Failed to fetch home page products',
        data: null,
      };
    }

    if (limitedLatestError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedLatestError });
    }

    if (limitedOnSaleError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedOnSaleError });
    }

    const successMessage = 'Fetched home page products sucessfully';

    log.info(successMessage);

    return {
      success: true,
      message: successMessage,
      data: { limitedLatestProducts, limitedOnSaleProducts },
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: null,
    };
  } finally {
    await logger.flush();
  }
}

export async function fetchAllProductsDynamic(): Promise<ResponseWithData<Product[] | null>> {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchAllProductsDynamic' });
  logger.info('Attempting to fetch all products');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return {
        success: false,
        message: 'Failed to fetch all products',
        data: null,
      };
    }

    const successMessage = 'Fetched all products sucessfully';

    log.info(successMessage);

    return {
      success: true,
      message: successMessage,
      data,
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: null,
    };
  } finally {
    await logger.flush();
  }
}

export async function fetchProductsByCategoryDynamic(category: string): Promise<ResponseWithData<Product[] | null>> {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchProductsByCategoryDynamic', category });
  logger.info('Attempting to fetch products by category');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('category', category)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return {
        success: false,
        message: 'Failed to fetch products by category',
        data: null,
      };
    }

    const successMessage = 'Fetched products by category sucessfully';

    log.info(successMessage);

    return {
      success: true,
      message: successMessage,
      data,
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: null,
    };
  } finally {
    await logger.flush();
  }
}

export async function fetchProductsOnSaleDynamic(): Promise<ResponseWithData<Product[] | null>> {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchProductsOnSaleDynamic' });
  logger.info('Attempting to fetch products on sale');

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('isOnSale', true)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('salePercentage', { ascending: false });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return {
        success: false,
        message: 'Failed to fetch products on sale',
        data: null,
      };
    }

    const successMessage = 'Fetched products on sale sucessfully';

    log.info(successMessage);

    return {
      success: true,
      message: successMessage,
      data,
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: null,
    };
  } finally {
    await logger.flush();
  }
}

export async function fetchProductByIdDynamic(id: string): Promise<ResponseWithData<Product | null>> {
  const supabase = await createSupabaseServerClient();

  const logger = log.with({ context: 'dbQuery: fetchProductsByIdDynamic', id });
  logger.info('Attempting to fetch products by id');

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('productId', id)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return {
        success: false,
        message: 'Failed to fetch products by id',
        data: null,
      };
    }

    const successMessage = 'Fetched products by id sucessfully';

    log.info(successMessage);

    return {
      success: true,
      message: successMessage,
      data: product[0],
    };
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error });
    return {
      success: false,
      message: USER_ERROR_MESSAGES.unexpected,
      data: null,
    };
  } finally {
    await logger.flush();
  }
}
