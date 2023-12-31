import { deleteImageFromStorage } from '@/lib/firebase';
import deleteProductImageDataFromDb from '@/services/product-image-data/delete-product-image-data';
import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';

// Delete images that have been uploaded to storage.
// If a productId exists, delete related image data (image url, etc) from database.

export async function deleteAllProductImages(
  imageData: InsertProductImageDataTypeStore[],
  productId?: string | null
): Promise<CustomResponseType> {
  let dbDataDeleteSuccess = true;

  try {
    const storageImagesToDelete = imageData.map((data) => data.file_name);

    const storageDeletePromises = storageImagesToDelete.map(
      (file_name) => file_name.length > 0 && deleteImageFromStorage(file_name)
    );

    const storageDeleteResults = await Promise.allSettled(storageDeletePromises);

    const storageDeleteSuccess = storageDeleteResults.every((result) => result.status === 'fulfilled');

    if (productId) {
      const dbProductImageDataToDelete = imageData.map((data) => data.product_image_id);

      const dbProductImageDataDeletePromises = dbProductImageDataToDelete.map((product_image_id) =>
        deleteProductImageDataFromDb(product_image_id!)
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
  } catch (error) {
    throw error;
  }
}
