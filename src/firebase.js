// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDxGzgL7m-N5eCF3ob2hMsMW8vNfyYisE",
  authDomain: "oruga-coworking.firebaseapp.com",
  projectId: "oruga-coworking",
  storageBucket: "oruga-coworking.appspot.com",
  messagingSenderId: "71090394979",
  appId: "1:71090394979:web:e01a2a08dabd75bfcd2556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app



