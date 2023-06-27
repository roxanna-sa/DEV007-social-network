// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0CRwLywXOThcI0OfTRq3oRhcxAPL9tyo",
  authDomain: "social-network-366e3.firebaseapp.com",
  projectId: "social-network-366e3",
  storageBucket: "social-network-366e3.appspot.com",
  messagingSenderId: "950269992658",
  appId: "1:950269992658:web:9bab051b05fdb8851b570b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage();
