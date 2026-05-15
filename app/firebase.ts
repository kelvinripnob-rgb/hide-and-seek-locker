import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCP-PXwgE2NY7ji15lMtMFELjCdLsZ4oS0",
  authDomain: "hide-and-seek-a1568.firebaseapp.com",
  projectId: "hide-and-seek-a1568",
  storageBucket: "hide-and-seek-a1568.firebasestorage.app",
  messagingSenderId: "250936024257",
  appId: "1:250936024257:web:2286d6f2ec5a4eb6398840"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);