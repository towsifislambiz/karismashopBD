import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Karishma Shop BD - Production Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB06vKkDkuUfimF_G_eBQo95mfgSWovqGA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "karishamashopbd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "karishamashopbd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "karishamashopbd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "940643545209",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:940643545209:web:0568c3b48bde48e28d24a8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XF0F42DQR3"
};

// Initialize Firebase App singleton
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firestore Real-time Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Analytics (Safe initialization for browsers)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
