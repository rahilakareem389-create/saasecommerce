import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace these placeholders with your actual Firebase config keys
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_FIREBASE_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_FIREBASE_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_FIREBASE_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Only initialize full Firebase Auth if a real API key is provided
// This prevents 400 Bad Request console errors from identitytoolkit
let app;
let authInstance;

if (firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY") {
  app = initializeApp(firebaseConfig);
  authInstance = getAuth(app);
} else {
  // Mock auth object for the Checkout page to gracefully fail
  authInstance = { app: { options: firebaseConfig } };
}

export const auth = authInstance;
