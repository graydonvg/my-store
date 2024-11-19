import { LOGGER_ERROR_MESSAGES } from '@/constants';
import { initializeApp } from 'firebase/app';
import {
  StorageObserver,
  UploadTaskSnapshot,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Logger } from 'next-axiom';

const log = new Logger();

const firebaseConfig = {
  apiKey: 'AIzaSyA9L6rqC6ZmaNrRWw1XO9ODlSU7ocFPLI4',
  authDomain: 'my-shop-7cfcc.firebaseapp.com',
  projectId: 'my-shop-7cfcc',
  storageBucket: 'my-shop-7cfcc.appspot.com',
  messagingSenderId: '575545358137',
  appId: '1:575545358137:web:b4e524ba7bc29627ea5ae8',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app, 'gs://my-shop-7cfcc.appspot.com/');

export async function uploadProductImageToStorage(
  file: Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  observer: StorageObserver<UploadTaskSnapshot> | ((snapshot: UploadTaskSnapshot) => unknown) | null | undefined
): Promise<{ imageUrl: string; fileName: string }> {
  const logger = log.with({ context: 'firebase: uploadProductImageToStorage' });
  logger.info('Attempting to upload product image to storage', { fileName });

  const imageRef = ref(storage, `product-images/${fileName}`);
  const uploadImage = uploadBytesResumable(imageRef, file);

  return await new Promise((resolve, reject) => {
    uploadImage.on(
      'state_changed',
      observer,
      (error) => {
        logger.error('Upload state change error', { error, fileName });
        reject({ error, fileName });
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadImage.snapshot.ref);
          logger.info('Product image uploaded successfully', { fileName, downloadURL });
          resolve({ imageUrl: downloadURL, fileName });
        } catch (error) {
          logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error, fileName });
          reject({ error, fileName });
        } finally {
          await logger.flush();
        }
      }
    );
  });
}

export async function deleteProductImageFromStorage(fileName: string) {
  const logger = log.with({ context: 'firebase: deleteProductImageFromStorage' });
  logger.info('Attempting to delete product image from storage', { fileName });

  const imageRef = ref(storage, `product-images/${fileName}`);

  try {
    await deleteObject(imageRef);
    logger.info('Product image deleted successfully', { fileName });
  } catch (error) {
    logger.error(LOGGER_ERROR_MESSAGES.unexpected, { error, fileName });
    throw error;
  } finally {
    await logger.flush();
  }
}
