// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDD4phU63gF9EsPbbFduL6JuLV9Q3a11lI",
  authDomain: "queuesync-a8bd0.firebaseapp.com",
  databaseURL: "https://queuesync-a8bd0-default-rtdb.firebaseio.com",
  projectId: "queuesync-a8bd0",
  storageBucket: "queuesync-a8bd0.firebasestorage.app",
  messagingSenderId: "144689954779",
  appId: "1:144689954779:web:c9d8d9a1abce7a08f7b1fe",
  measurementId: "G-CS4TYHCZXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore instance
export const db = getFirestore(app);
