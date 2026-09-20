import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7xR7F52erhgBpJO9Qq2BfqH-X-M341bY",
  authDomain: "studyroombooking-ef9a6.firebaseapp.com",
  projectId: "studyroombooking-ef9a6",
  storageBucket: "studyroombooking-ef9a6.firebasestorage.app",
  messagingSenderId: "159953413918",
  appId: "1:159953413918:web:bf3f9e27081cfa8247cb0f",
  measurementId: "G-SMBYRYNWFW",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);    