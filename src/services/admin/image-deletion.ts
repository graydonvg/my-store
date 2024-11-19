import { ProductImageData } from '@/types';
import { deleteProductImageFromStorage } from '@/lib/firebase';
import { deleteProductImageDataFromDb } from '@/services/admin/delete';
import { Logger } from 'next-axiom';

const log = new Logger();

async function deleteFromStorage(fileNames: string[]) {
  const storageDeletePromises = fileNames
    .filter((fileName) => fileName.length > 0)
    .map((fileName) => deleteProductImageFromStorage(fileName));

  const results = await Promise.allSettled(storageDeletePromises);
  const success = results.every((result) => result.status === 'fulfilled');

  return { success, results };
}

async function deleteFromDatabase(productImageIds: number[]) {
  const dbDeletePromises = productImageIds.map((id) => deleteProductImageDataFromDb(id));
  const results = await Promise.allSettled(dbDeletePromises);
  const success = results.every((result) => result.status === 'fulfilled');

  return { success, results };
}

export async function deleteProductImagesFromStorage(imageData: ProductImageData[]) {
  const fileNames = imageData.map((data) => data.fileName);
  const { success, results } = await deleteFromStorage(fileNames);

  if (success) {
    return { success: true, message: 'Product images deleted successfully from storage.' };
  } else {
    log.error('Failed to delete images from storage', { results });
    return { success: false, message: 'Failed to delete product images from storage.' };
  }
}

export async function deleteProductImagesDataFromDb(imageData: ProductImageData[]) {
  const productImageIds = imageData.map((data) => data.productImageId!);
  const { success, results } = await deleteFromDatabase(productImageIds);

  if (success) {
    return { success: true, message: 'Product image data deleted successfully from the database.' };
  } else {
    log.error('Failed to delete product image data from the database', { results });
    return { success: false, message: 'Failed to delete product image data from the database.' };
  }
}

export async function deleteAllProductImages(imageData: ProductImageData[], productId?: number | null) {
  let dbDeleteResponse = {
    success: true,
    message: 'No image data has been added to the database',
  };

  const storageDeleteResponse = await deleteProductImagesFromStorage(imageData);

  if (productId) {
    dbDeleteResponse = await deleteProductImagesDataFromDb(imageData);
  }

  if (!storageDeleteResponse.success && !dbDeleteResponse.success) {
    return {
      success: false,
      message: 'Failed to delete product images. Storage and database error.',
    };
  } else if (!storageDeleteResponse.success) {
    return { success: false, message: storageDeleteResponse.message };
  } else if (!dbDeleteResponse.success) {
    return { success: false, message: dbDeleteResponse.message };
  } else {
    return { success: true, message: 'Product images deleted successfully.' };
  }
}
