// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwgY0IjOvmxIQ7l2T-9xffHj4agyfi-yU",
  authDomain: "resume-builder-c2e44.firebaseapp.com",
  projectId: "resume-builder-c2e44",
  storageBucket: "resume-builder-c2e44.firebasestorage.app",
  messagingSenderId: "994057758419",
  appId: "1:994057758419:web:8873af043553fa72b39626",
  measurementId: "G-7HJ2WSKBZX"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

