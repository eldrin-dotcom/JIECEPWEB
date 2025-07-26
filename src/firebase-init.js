// js/firebase-init.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD8jtMJwKMWrnowPIHCP7OajKMwXD8Ybz8",
    authDomain: "jiecep-website-ca9b3.firebaseapp.com",
    projectId: "jiecep-website-ca9b3",
    storageBucket: "jiecep-website-ca9b3.firebasestorage.app",
    messagingSenderId: "332378020174",
    appId: "1:332378020174:web:345fd8bfc6ec234b91e61f",
    measurementId: "G-5ZEM3S2X79"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get service instances
const auth = getAuth(app);
const db = getFirestore(app);

// Log for confirmation (optional, good for debugging)
console.log("Firebase app and services initialized. Waiting for auth state in main script...");

// Export the initialized app and service instances for use in other modules
export { app, auth, db };