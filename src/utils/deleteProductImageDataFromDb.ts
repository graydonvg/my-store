import deleteProductImageDataFromDb from '@/services/product-image-data/delete';
import { InsertProductImageDataTypeStore } from '@/types';

export async function deleteProductImagesDataFromDb(imageData: InsertProductImageDataTypeStore[]) {
  const dbProductImageDataToDelete = imageData.map((data) => data.productImageId);

  const dbProductImageDataDeletePromises = dbProductImageDataToDelete.map((productImageId) =>
    deleteProductImageDataFromDb(productImageId!)
  );

  const dbDataDeleteResults = await Promise.allSettled(dbProductImageDataDeletePromises);

  const dbDataDeleteSuccess = dbDataDeleteResults.every((result) => result.status === 'fulfilled');

  if (dbDataDeleteSuccess === true) {
    return { success: true, message: 'Successfully deleted all product images data from database' };
  } else {
    return { success: false, message: 'Failed to delete all product images data from database' };
  }
}
