
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKZfnWcwayicnm990Xj7coHhjqQDGp57o",
  authDomain: "nex-chat-12d4a.firebaseapp.com",
  databaseURL: "https://nex-chat-12d4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nex-chat-12d4a",
  storageBucket: "nex-chat-12d4a.firebasestorage.app",
  messagingSenderId: "684361971117",
  appId: "1:684361971117:web:8576522d8ac8d1042f1d24"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
