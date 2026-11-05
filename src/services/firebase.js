import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCe-AwJYcGwXNtrYSgNTjkmNoNz0op2fyo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "karishma-shop.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "galaxy-gadgets",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "karishma-shop.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "47510533469",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:47510533469:web:528518644c9a94c847a4b4"
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;