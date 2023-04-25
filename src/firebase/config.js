// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore/lite'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfbTVmkwt5GC5O8SQC-aHraDss8G0UThs",
  authDomain: "oruga-8e877.firebaseapp.com",
  projectId: "oruga-8e877",
  storageBucket: "oruga-8e877.appspot.com",
  messagingSenderId: "184087297392",
  appId: "1:184087297392:web:eaf8837dd61b492154e3b5",
  measurementId: "G-08GGVN1VTQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(app);
export const FirebaseDB = getFirestore(app);

// const analytics = getAnalytics(app);