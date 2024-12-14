import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ResponseWithData, Product } from '@/types';
import { NextResponse } from 'next/server';
import { log, withAxiom } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const GET = withAxiom(
  async (): Promise<
    NextResponse<
      ResponseWithData<{ limitedLatestProducts: Product[] | null; limitedOnSaleProducts: Product[] | null } | null>
    >
  > => {
    const supabase = await createSupabaseServerClient();

    log.info('Attempting to fetch home page products');

    try {
      const { data: limitedLatestProducts, error: limitedLatestError } = await supabase
        .from('products')
        .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
        .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
        .order('createdAt', { ascending: false })
        .limit(3);

      const { data: limitedOnSaleProducts, error: limitedOnSaleError } = await supabase
        .from('products')
        .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
        .eq('isOnSale', true)
        .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
        .order('salePercentage', { ascending: false })
        .limit(3);

      if (limitedLatestError && limitedOnSaleError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedLatestError });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch home page products',
            data: null,
          },
          { status: 500 }
        );
      }

      if (limitedLatestError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedLatestError });
      }

      if (limitedOnSaleError) {
        log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error: limitedOnSaleError });
      }

      const successMessage = 'Fetched home page products sucessfully';

      log.info(successMessage);

      return NextResponse.json(
        {
          success: true,
          message: successMessage,
          data: { limitedLatestProducts, limitedOnSaleProducts },
        },
        { status: 200 }
      );
    } catch (error) {
      log.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
          data: null,
        },
        { status: 500 }
      );
    } finally {
      await log.flush();
    }
  }
);
