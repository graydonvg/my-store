import { AddNewProductFormDataType, ProductDataType } from '@/types';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  NextOrObserver,
  User,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  getDocs,
} from 'firebase/firestore/lite';
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
const db = getFirestore(app);
const storage = getStorage(app, 'gs://my-shop-7cfcc.appspot.com/');

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

const auth = getAuth(app);

export function onAuthStateChangedListener(callback: NextOrObserver<User>) {
  onAuthStateChanged(auth, callback);
}

export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

export async function createAuthUserWithEmailAndPassword(email: string, password: string) {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInAuthUserWithEmailAndPassword(email: string, password: string) {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutUser() {
  await signOut(auth);
}

export async function createUserDocument(userData = {}) {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        createdAt,
        firstName: '',
        lastName: '',
        isAdmin: false,
        ...userData,
      });
    } catch (error) {
      throw error;
    }
  }

  return;
}

export async function getUserDoc() {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) return;

  return userDoc.data();
}

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

export async function addProductToDatabase(productData: AddNewProductFormDataType) {
  if (!auth.currentUser) return;

  const productDocRef = doc(db, 'product-categories', productData.category);
  const productDoc = await getDoc(productDocRef);

  if (!productDoc.exists()) {
    try {
      await setDoc(productDocRef, {
        products: [
          {
            ...productData,
          },
        ],
        title: productData.category,
      });
      return 'success';
    } catch (error) {
      throw error;
    }
  } else {
    try {
      await updateDoc(productDocRef, {
        products: arrayUnion({
          ...productData,
        }),
      });
      return 'success';
    } catch (error) {
      throw error;
    }
  }
}

export async function getProductsFromDatabase() {
  const collectionRef = collection(db, 'product-categories');
  const q = query(collectionRef);

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (docSnapshot) => docSnapshot.data() as { title: string; products: ProductDataType[] }
    );
  } catch (error) {
    throw error;
  }
}
