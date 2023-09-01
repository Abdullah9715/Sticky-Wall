// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaU_9h9a7mDeaz4Xm3eojJ8dY8392hbyo",
  authDomain: "stickwall-47685.firebaseapp.com",
  projectId: "stickwall-47685",
  storageBucket: "stickwall-47685.appspot.com",
  messagingSenderId: "1034794947041",
  appId: "1:1034794947041:web:275782607cb491f8b642a0",
  measurementId: "G-SQXVFRWFZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

export {app,analytics,firestore,auth};