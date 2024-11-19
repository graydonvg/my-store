import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Product, ResponseWithData } from '@/types';
import { NextResponse } from 'next/server';
import { log, withAxiom } from 'next-axiom';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const GET = withAxiom(async (): Promise<NextResponse<ResponseWithData<Product[] | null>>> => {
  const supabase = await createSupabaseServerClient();

  log.info('Attempting to fetch limited products on sale');

  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('isOnSale', true)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true })
      .order('salePercentage', { ascending: false })
      .limit(3);

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch products',
          data: null,
        },
        { status: 500 }
      );
    }

    const successMessage = 'Fetched products sucessfully';

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        data: products,
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
});
