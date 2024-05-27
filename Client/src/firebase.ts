// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-59488.firebaseapp.com",
  projectId: "realestate-59488",
  storageBucket: "realestate-59488.appspot.com",
  messagingSenderId: "1051273056114",
  appId: "1:1051273056114:web:e5fc602737ed3492df97eb"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);