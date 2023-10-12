import { productFormDataType } from '@/types';
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
  updateProfile,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore/lite';
import {
  StorageObserver,
  UploadTaskSnapshot,
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
      console.error('error creating user', error);
    }
  }

  return;
}

export async function getUserDoc() {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data();
  }

  return;
}

export async function uploadImageToStorage(
  file: Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  observer: StorageObserver<UploadTaskSnapshot> | ((snapshot: UploadTaskSnapshot) => unknown) | null | undefined
): Promise<string> {
  const storageRef = ref(storage, `ecommerce/${fileName}`);
  const uploadImage = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadImage.on(
      'state_changed',
      observer,
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => reject(error));
      }
    );
  });
}

export async function addProductToDatabase(productData: productFormDataType) {
  if (!auth.currentUser) return;

  const productDocRef = doc(db, 'product-categories', productData.category);
  const productDoc = await getDoc(productDocRef);
  const createdAt = new Date();

  if (!productDoc.exists()) {
    try {
      await setDoc(productDocRef, {
        products: [
          {
            createdAt,
            ...productData,
          },
        ],
      });
    } catch (error) {
      console.error('error creating category', error);
    }
  } else {
    try {
      await updateDoc(productDocRef, {
        products: arrayUnion({
          createdAt,
          ...productData,
        }),
      });
    } catch (error) {
      console.error('error updating category', error);
    }
  }

  return;
}

// (snapshot) => {
// 	const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// 	// console.log('Upload is ' + progress + '% done');
// 	switch (snapshot.state) {
// 		case 'paused':
// 			// console.log('Upload is paused');
// 			break;
// 		case 'running':
// 			// console.log('Upload is running');
// 			break;
// 	}
// }
