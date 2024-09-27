import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { ResponseWithData, ProductsFilterOptions, ProductCategorySchema, ProductsFilterCriteria } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { CONSTANTS } from '@/constants';
import { log, withAxiom } from 'next-axiom';
import { z } from 'zod';

function handleValidationError(validationResult: z.SafeParseError<any>, payload: any) {
  log.warn(CONSTANTS.LOGGER_ERROR_MESSAGES.VALIDATION, {
    payload,
    error: validationResult.error,
  });

  return NextResponse.json(
    {
      success: false,
      message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
      data: null,
    },
    { status: 400 }
  );
}

export const POST = withAxiom(
  async (request: NextRequest): Promise<NextResponse<ResponseWithData<ProductsFilterOptions[] | null>>> => {
    const supabase = await createSupabaseServerClient();

    log.info('Attempting to fetch products filter options');

    try {
      let filterData: ProductsFilterCriteria;

      try {
        filterData = await request.json();
      } catch (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.PARSE, { error });

        return NextResponse.json(
          {
            success: false,
            message: CONSTANTS.USER_ERROR_MESSAGES.UNEXPECTED,
            data: null,
          },
          { status: 400 }
        );
      }

      const { category, onSale } = filterData;

      const categoryValidation = category && ProductCategorySchema.safeParse(category);
      const onSaleValidation = onSale ? z.boolean().safeParse(onSale) : undefined;

      if (category && categoryValidation && !categoryValidation.success) {
        return handleValidationError(categoryValidation, category);
      }

      if (onSale && onSaleValidation && !onSaleValidation.success) {
        return handleValidationError(onSaleValidation, onSale);
      }

      const rpcArgs = categoryValidation?.data
        ? { category_input: categoryValidation.data }
        : onSaleValidation?.data
        ? { onsale: onSaleValidation.data }
        : {};

      const { data, error } = await supabase.rpc('getProductFilterOptions', rpcArgs);

      if (error) {
        log.error(CONSTANTS.LOGGER_ERROR_MESSAGES.DATABASE_SELECT, { error });

        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch products filter options',
            data: null,
          },
          { status: 500 }
        );
      }

      const successMessage = 'Fetched products filter options sucessfully';

      log.info(successMessage);

      return NextResponse.json(
        {
          success: true,
          message: successMessage,
          data,
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
