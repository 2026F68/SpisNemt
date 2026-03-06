import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDS3aIQQwv-mLZXW4q0QGFlIPiPbEiLmzI",
  authDomain: "spisnemt.firebaseapp.com",
  projectId: "spisnemt",
  storageBucket: "spisnemt.firebasestorage.app",
  messagingSenderId: "353178499033",
  appId: "1:353178499033:web:ffca92b7198b09fd2fcbc8",
  measurementId: "G-EF35VFNEBJ"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const db = getFirestore(app);

export default db;
