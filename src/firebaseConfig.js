import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1AZtYt4RA2QWGbzxVHdO8MDoH1bo1WV0",
  authDomain: "ddelectric-equip.firebaseapp.com",
  projectId: "ddelectric-equip",
  storageBucket: "ddelectric-equip.firebasestorage.app",
  messagingSenderId: "611761031664",
  appId: "1:611761031664:web:e38bf733e979c5b1f17535",
  measurementId: "G-5SHJ0Y5LBF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
