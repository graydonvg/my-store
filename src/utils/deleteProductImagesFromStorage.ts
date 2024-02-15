import { deleteProductImageFromStorage } from '@/lib/firebase';
import { CustomResponseType, InsertProductImageDataTypeStore } from '@/types';

export async function deleteProductImagesFromStorage(
  imageData: InsertProductImageDataTypeStore[]
): Promise<CustomResponseType> {
  const storageImagesToDelete = imageData.map((data) => data.fileName);

  const storageDeletePromises = storageImagesToDelete.map(
    (fileName) => fileName.length > 0 && deleteProductImageFromStorage(fileName)
  );

  const storageDeleteResults = await Promise.allSettled(storageDeletePromises);

  const storageDeleteSuccess = storageDeleteResults.every((result) => result.status === 'fulfilled');

  if (storageDeleteSuccess === true) {
    return { success: true, message: 'Successfully deleted all product images from storage' };
  } else {
    return { success: false, message: 'Failed to delete all product images from storage' };
  }
}
