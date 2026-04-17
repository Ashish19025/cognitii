// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAId9r65zStPZOgcOnSKrxmvtd2TLIYOrI",
  authDomain: "cognitii-644c0.firebaseapp.com",
  projectId: "cognitii-644c0",
  storageBucket: "cognitii-644c0.firebasestorage.app",
  messagingSenderId: "375641216728",
  appId: "1:375641216728:web:18ffc2f81890bc2f9ea9ad",
  measurementId: "G-HQZ48Z7GPY",
};

// Initialize Firebase safely to prevent hot-reload duplicates
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
