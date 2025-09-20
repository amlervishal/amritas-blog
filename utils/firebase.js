import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Set App Check debug token for localhost development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkLozmCnPQgugpyfL79_EEF5-CBS1Hl7E",
  authDomain: "pindropsilence-26bda.firebaseapp.com",
  projectId: "pindropsilence-26bda",
  storageBucket: "pindropsilence-26bda.appspot.com",
  messagingSenderId: "641581851451",
  appId: "1:641581851451:web:b023de3c17ac51cccc8d1e",
  measurementId: "G-Y38HTMVGHF"
};

// Initialize Firebase (prevent multiple initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;