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
import { getFirestore, doc, getDoc, setDoc, collection, query, getDocs } from 'firebase/firestore/lite';

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
