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
  signOut(auth);
}

export async function createUserDocumentFromAuth(additionalInformation = {}) {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    return;
  } else {
    const { email, displayName } = auth.currentUser;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        createdAt,
        displayName,
        email,
        ...additionalInformation,
      });
    } catch (error) {
      console.error('error creating user', error);
    }
  }
}

export async function getUserDocFromAuth() {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, 'users', auth.currentUser.uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
}

export async function updateUserProfile(displayName: string) {
  if (!auth.currentUser) return;

  await updateProfile(auth.currentUser, { displayName });

  return auth.currentUser;
}
