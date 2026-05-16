import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDg2kmMv7uMlQ0MmBXJKTWUdN0dNiIbkW8",
  authDomain: "tkd-neo.firebaseapp.com",
  projectId: "tkd-neo",
  storageBucket: "tkd-neo.firebasestorage.app",
  messagingSenderId: "467336243802",
  appId: "1:467336243802:web:646e231eff300d14b38663"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
