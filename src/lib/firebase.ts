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

const firebaseConfig = {
  apiKey: 'AIzaSyDUCp-SSzxV6KwvpnGHIOb4emPq69j43wc',
  authDomain: 'my-store-88000.firebaseapp.com',
  projectId: 'my-store-88000',
  storageBucket: 'my-store-88000.appspot.com',
  messagingSenderId: '115693309462',
  appId: '1:115693309462:web:68ca67c602087457aa6f37',
};

const app = initializeApp(firebaseConfig);

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
