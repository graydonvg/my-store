import { ProductImageData } from '@/types';
import { deleteProductImageFromStorage } from '@/lib/firebase';
import { deleteProductImageDataFromDb } from '@/services/admin/delete';

export async function deleteProductImagesFromStorage(imageData: ProductImageData[]) {
  const storageImagesToDelete = imageData.map((data) => data.fileName);

  const storageDeletePromises = storageImagesToDelete.map(
    (fileName) => fileName.length > 0 && deleteProductImageFromStorage(fileName)
  );

  const storageDeleteResults = await Promise.allSettled(storageDeletePromises);

  const storageDeleteSuccess = storageDeleteResults.every((result) => result.status === 'fulfilled');

  if (storageDeleteSuccess === true) {
    return { success: true, message: 'Product images deleted sucessfully' };
  } else {
    return { success: false, message: 'Failed to delete all product images from storage' };
  }
}

export async function deleteProductImagesDataFromDb(imageData: ProductImageData[]) {
  const dbProductImageDataToDelete = imageData.map((data) => data.productImageId);

  const dbProductImageDataDeletePromises = dbProductImageDataToDelete.map((productImageId) =>
    deleteProductImageDataFromDb(productImageId!)
  );

  const dbDataDeleteResults = await Promise.allSettled(dbProductImageDataDeletePromises);

  const dbDataDeleteSuccess = dbDataDeleteResults.every((result) => result.status === 'fulfilled');

  if (dbDataDeleteSuccess === true) {
    return { success: true, message: 'Product image data deleted sucessfully' };
  } else {
    return { success: false, message: 'Failed to delete all product images data from database' };
  }
}

// Delete images that have been uploaded to storage.
// If a productId exists, delete related image data (image url, etc) from database.

export async function deleteAllProductImages(imageData: ProductImageData[], productId?: number | null) {
  let dbDeleteResponse = {
    success: true,
    message: 'No image data has been added to the database',
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
    return { success: true, message: 'Successfully deleted all images' };
  }
}
