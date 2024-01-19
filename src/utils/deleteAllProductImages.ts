import { deleteImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';

// Delete images that have been uploaded to storage.
// If a productId exists, delete related image data (image url, etc) from database.

export async function deleteAllProductImages(
  imageData: InsertProductImageDataTypeStore[],
  productId?: string | null
): Promise<CustomResponseType> {
  let dbDataDeleteSuccess = true;

  const storageImagesToDelete = imageData.map((data) => data.fileName);

  const storageDeletePromises = storageImagesToDelete.map(
    (fileName) => fileName.length > 0 && deleteImageFromStorage(fileName)
  );

  const storageDeleteResults = await Promise.allSettled(storageDeletePromises);

  const storageDeleteSuccess = storageDeleteResults.every((result) => result.status === 'fulfilled');

  if (productId) {
    const dbProductImageDataToDelete = imageData.map((data) => data.productImageId);

    const dbProductImageDataDeletePromises = dbProductImageDataToDelete.map((productImageId) =>
      deleteProductImageDataFromDb(productImageId!)
    );

    const dbDataDeleteResults = await Promise.allSettled(dbProductImageDataDeletePromises);

    dbDataDeleteSuccess = dbDataDeleteResults.every((result) => result.status === 'fulfilled');
  }

  if (!storageDeleteSuccess && !dbDataDeleteSuccess) {
    return { success: false, message: 'Failed to delete all images. Storage and database error.' };
  } else if (!storageDeleteSuccess) {
    return { success: false, message: 'Failed to delete all images. Storage  error.' };
  } else if (!dbDataDeleteSuccess) {
    return { success: false, message: 'Failed to delete all images. Database  error.' };
  } else {
    return { success: true, message: 'Successfully deleted all images.' };
  }
}
