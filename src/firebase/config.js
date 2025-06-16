import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA47K6EZxwLciGVMktPuw1x9zJEyjcQFO4",
  authDomain: "job-portal-261b3.firebaseapp.com",
  projectId: "job-portal-261b3",
  storageBucket: "job-portal-261b3.appspot.com", 
  messagingSenderId: "896770450895",
  appId: "1:896770450895:web:020f159bfe1de35aaa5eba",
  measurementId: "G-6NBCDTEWB2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);