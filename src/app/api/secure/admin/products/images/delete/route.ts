import { NextResponse } from 'next/server';
import { DeleteProductImage, DeleteProductImageSchema, ResponseWithNoData } from '@/types';
import createSupabaseServerClient from '@/lib/supabase/supabase-server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { getUserRoleFromSession } from '@/utils/auth';
import checkAuthorizationServer from '@/utils/checkAuthorizationServer';
import { LOGGER_ERROR_MESSAGES, USER_ERROR_MESSAGES } from '@/constants';

export const DELETE = withAxiom(async (request: AxiomRequest): Promise<NextResponse<ResponseWithNoData>> => {
  const supabase = await createSupabaseServerClient();
  let log = request.log;

  log.info('Attempting to delete product image(s)');

  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      log.error(LOGGER_ERROR_MESSAGES.authentication, { error: authError });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.authentication,
        },
        { status: 500 }
      );
    }

    if (!authUser) {
      log.warn(LOGGER_ERROR_MESSAGES.notAuthenticated, { user: authUser });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthenticated,
        },
        { status: 401 }
      );
    }

    log = request.log.with({ userId: authUser.id });

    const isAuthorized = await checkAuthorizationServer(supabase, 'productImages.delete');

    if (!isAuthorized) {
      const userRole = await getUserRoleFromSession(supabase);
      log.warn(LOGGER_ERROR_MESSAGES.notAuthorized, { userRole });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.notAuthorized,
        },
        { status: 401 }
      );
    }

    let imageData: DeleteProductImage;

    try {
      imageData = await request.json();
    } catch (error) {
      log.error(LOGGER_ERROR_MESSAGES.parse, { error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const validation = DeleteProductImageSchema.safeParse(imageData);

    if (!validation.success) {
      log.error(LOGGER_ERROR_MESSAGES.validation, { error: validation.error });

      return NextResponse.json(
        {
          success: false,
          message: USER_ERROR_MESSAGES.unexpected,
        },
        { status: 400 }
      );
    }

    const productImageIds = validation.data
      .filter((item) => item.productImageId !== undefined)
      .map((item) => item.productImageId);

    // Unless the product has been added, an image will not have a db entry so no ID.
    // If no ID, skip this step and delete the image from storage.
    const { data: dbData, error: dbError } = productImageIds.length
      ? await supabase.from('productImageData').delete().in('productImageId', productImageIds).select('fileName')
      : { data: null, error: null };

    const fileNamesOfDeletedImageData = dbData?.map((item) => item.fileName);

    const fileNamesOfImagesWithNoIds = validation.data
      .filter((item) => item.productImageId === undefined)
      .map((item) => item.fileName);

    // Only include fileNames of images if the data was successfully deleted from the db or if the image had no db entry (no id)
    const imagesToDeleteFromStorage = fileNamesOfDeletedImageData?.length
      ? [...fileNamesOfImagesWithNoIds, ...fileNamesOfDeletedImageData]
      : fileNamesOfImagesWithNoIds;

    const { error: storageError } = imagesToDeleteFromStorage.length
      ? await supabase.storage.from('product-images').remove(imagesToDeleteFromStorage)
      : { error: null };

    if (dbError) {
      log.error(LOGGER_ERROR_MESSAGES.databaseDelete, { error: dbError });

      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete product image(s) data from database. ${dbError.message}.`,
        },
        { status: 500 }
      );
    }

    if (storageError) {
      log.error(LOGGER_ERROR_MESSAGES.storageDelete, { error: storageError });

      return NextResponse.json(
        {
          success: false,
          message: `Product image(s) data deleted from database, but failed to delete image(s) from storage. ${storageError.message}.`,
        },
        { status: 500 }
      );
    }

    const successMessage = `Product image(s) deleted successfully`;

    log.info(successMessage);

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    log.error(LOGGER_ERROR_MESSAGES.unexpected, { error });

    return NextResponse.json(
      {
        success: false,
        message: `Failed to delete product image(s). ${USER_ERROR_MESSAGES.unexpected}`,
      },
      { status: 500 }
    );
  } finally {
    await log.flush();
  }
});
