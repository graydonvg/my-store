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

export async function uploadImageToStorage(
  file: Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  observer: StorageObserver<UploadTaskSnapshot> | ((snapshot: UploadTaskSnapshot) => unknown) | null | undefined
): Promise<{ imageUrl: string; fileName: string }> {
  const imageRef = ref(storage, `product-images/${fileName}`);
  const uploadImage = uploadBytesResumable(imageRef, file);

  return await new Promise((resolve, reject) => {
    uploadImage.on('state_changed', observer, reject, async () => {
      try {
        const downloadURL = await getDownloadURL(uploadImage.snapshot.ref);
        resolve({ imageUrl: downloadURL, fileName });
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function deleteImageFromStorage(fileName: string) {
  const imageRef = ref(storage, `product-images/${fileName}`);

  try {
    await deleteObject(imageRef);
  } catch (error) {
    throw error;
  }
}
