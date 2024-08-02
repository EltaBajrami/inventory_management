// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQIu2pPPdVxAj0RDRHht4hoJjXCEXQEIw",
  authDomain: "inventory-management-dcb73.firebaseapp.com",
  projectId: "inventory-management-dcb73",
  storageBucket: "inventory-management-dcb73.appspot.com",
  messagingSenderId: "1075176349835",
  appId: "1:1075176349835:web:f461bdbd05da7f6cf0748e",
  measurementId: "G-82VSKHTZ0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}