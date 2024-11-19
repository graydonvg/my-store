import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { NumericIdSchema, Product, ResponseWithData } from '@/types';
import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/constructZodError';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const GET = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithData<Product | null>>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to fetch product by id');

  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');

    if (!productId) {
      log.error(LOGGER_ERROR_MESSAGES.noData);

      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid product ID',
          data: null,
        },
        { status: 400 }
      );
    }

    const validation = NumericIdSchema.safeParse(productId);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { value: productId, error: validation.error });

      const errorMessage = constructZodErrorMessage(validation.error);

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          data: null,
        },
        { status: 400 }
      );
    }

    const { data: product, error } = await supabase
      .from('products')
      .select('*, productImageData(fileName, imageUrl, productImageId, imageIndex)')
      .eq('productId', validation.data)
      .order('imageIndex', { referencedTable: 'productImageData', ascending: true });

    if (error) {
      log.error(LOGGER_ERROR_MESSAGES.databaseSelect, { error });

      return NextResponse.json(
        {
          success: false,
          message: 'Failed to fetch product',
          data: null,
        },
        { status: 500 }
      );
    }

    const successMessage = 'Fetched product sucessfully';

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        data: product[0],
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
