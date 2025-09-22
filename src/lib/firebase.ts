
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbW-J52EFol8-ROyHLfl3Y4bkEuBhkPuM",
  authDomain: "dropxindiq.firebaseapp.com",
  projectId: "dropxindiq",
  storageBucket: "dropxindiq.appspot.com",
  messagingSenderId: "985807666698",
  appId: "1:985807666698:web:7ebaee02e9c48cae8769f3",
  measurementId: "G-7MT17659G5"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
