import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpDN4tHDjhlLEWm4QYjDolsqo-oIvTfKc",
  authDomain: "launchlensai-3e6ba.firebaseapp.com",
  projectId: "launchlensai-3e6ba",
  storageBucket: "launchlensai-3e6ba.firebasestorage.app",
  messagingSenderId: "508107278084",
  appId: "1:508107278084:web:bb1061703afa456e5af251"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;