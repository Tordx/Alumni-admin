import { initializeApp } from "@firebase/app";
import { getAnalytics } from "@firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getStorage } from "@firebase/storage";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBZSu1F4-MfZPBFZ0tPN0XInD6WDsCEnY",
  authDomain: "alumniapp-96bb9.firebaseapp.com",
  projectId: "alumniapp-96bb9",
  storageBucket: "alumniapp-96bb9.appspot.com",
  messagingSenderId: "331515740444",
  appId: "1:331515740444:web:7da8e5010ad04c0de0fad9",
  measurementId: "G-X1X40S8T22"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
