import { CONSTANTS } from '@/constants';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { Product, ProductCategorySchema, ResponseWithData } from '@/types';
import { NextResponse } from 'next/server';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { constructZodErrorMessage } from '@/utils/construct';

export const GET = withAxiom(
  async (request: AxiomRequest): Promise<NextResponse<ResponseWithData<Product[] | null>>> => {
    const supabase = await createSupabaseServerClient();
    let log = request.log;

    log.info('Attempting to fetch products by category');

    try {
      const searchParams = request.nextUrl.searchParams;
      const category = searchParams.get('category');

      if (!category) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.NO_DATA);

        return NextResponse.json(
          {
            success: false,
            message: 'Please provide a valid category',
            data: null,
          },
          { status: 400 }
        );
      }

      const validation = ProductCategorySchema.safeParse(category);

      if (!validation.success) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, { value: category, error: validation.error });

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

      const { data: products, error } = await supabase
        .from('products')
        .select('*, productImageData(fileName, imageUrl, productImageId, index)')
        .eq('category', validation.data)
        .order('index', { referencedTable: 'productImageData', ascending: true })
        .order('createdAt', { ascending: false });

      if (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });

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
      log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.UNEXPECTED, { error });

      return NextResponse.json(
        {
          success: false,
          message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
          data: null,
        },
        { status: 500 }
      );
    } finally {
      await log.flush();
    }
  }
);
