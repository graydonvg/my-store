import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';
import { deleteProductImagesFromStorage } from './deleteProductImagesFromStorage';
import { deleteProductImagesDataFromDb } from './deleteProductImageDataFromDb';

// Delete images that have been uploaded to storage.
// If a productId exists, delete related image data (image url, etc) from database.

export async function deleteAllProductImages(
  imageData: InsertProductImageDataTypeStore[],
  productId?: string | null
): Promise<CustomResponseType> {
  let dbDeleteResponse: CustomResponseType = {
    success: true,
    message: 'No image data has been added to the database.',
  };

  const storageDeleteResponse = await deleteProductImagesFromStorage(imageData);

  if (productId) {
    dbDeleteResponse = await deleteProductImagesDataFromDb(imageData);
  }

  if (storageDeleteResponse.success === false && dbDeleteResponse.success === false) {
    return { success: false, message: 'Failed to delete all images. Storage and database error.' };
  } else if (storageDeleteResponse.success === false) {
    return { success: false, message: storageDeleteResponse.message };
  } else if (dbDeleteResponse.success === false) {
    return { success: false, message: dbDeleteResponse.message };
  } else {
    return { success: true, message: 'Successfully deleted all images.' };
  }
}
