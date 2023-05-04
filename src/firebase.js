// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app



