// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJZCW9GF4x4VQ_EI5SWSGrQ0I2BKEYQs8",
  authDomain: "petshop-852c2.firebaseapp.com",
  projectId: "petshop-852c2",
  storageBucket: "petshop-852c2.firebasestorage.app",
  messagingSenderId: "102326865060",
  appId: "1:102326865060:web:b9c5e2d023112bcc0baa31",
  measurementId: "G-G3JDH9X13Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

// Export Firebase instances
export { app, db };
