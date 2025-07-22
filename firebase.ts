import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBZ_opxhkhkHyEI9ua_rlbLNJ2MdfDjj0",
  authDomain: "primemedia-43d42.firebaseapp.com",
  projectId: "primemedia-43d42",
  storageBucket: "primemedia-43d42.firebasestorage.app",
  messagingSenderId: "500510903835",
  appId: "1:500510903835:web:5a9684b8112b3489b532be"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
