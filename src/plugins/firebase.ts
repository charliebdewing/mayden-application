import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBuqS3P_dkUWRnb3ajwuSHd5gr1qA4Y3Nk",
  authDomain: "c-e-mayden-app.firebaseapp.com",
  projectId: "c-e-mayden-app",
  storageBucket: "c-e-mayden-app.firebasestorage.app",
  messagingSenderId: "934507119425",
  appId: "1:934507119425:web:f83d26ceed2d12a1ac17c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Auth
getAuth(app)
