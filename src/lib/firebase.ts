import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { signInAnonymously, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBiQgEtLUyA721ngN60ck7U2mbQDyBqVEM",
  authDomain: "hivemime-6072d.firebaseapp.com",
  projectId: "hivemime-6072d",
  storageBucket: "hivemime-6072d.firebasestorage.app",
  messagingSenderId: "257087643987",
  appId: "1:257087643987:web:5385198ebcadf5656201a6",
  measurementId: "G-LPYZZ5TSD9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser: User | null | undefined = undefined;
const checkPromise = new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    resolve(user);
  });
});

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

auth.app.automaticDataCollectionEnabled = false;

export async function getCurrentUser() {
  await checkPromise;
  return currentUser;
}

export async function refreshUser() {
  if (currentUser)
    await currentUser.reload();

  return currentUser;
}

export function logInAnonymously() {
  return signInAnonymously(auth);
}

export function logInWithEmailPassword(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function sendVerificationEmail() {
  return sendEmailVerification(currentUser!);
}

export async function createWithEmailPassword(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export function logInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logOut() {
  return auth.signOut();
}