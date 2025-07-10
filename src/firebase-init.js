// js/firebase-init.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD8jtMJwKMWrnowPIHCP7OajKMwXD8Ybz8",
    authDomain: "jiecep-website-ca9b3.firebaseapp.com",
    projectId: "jiecep-website-ca9b3",
    storageBucket: "jiecep-website-ca9b3.firebasestorage.app",
    messagingSenderId: "332378020174",
    appId: "1:332378020174:web:345fd8bfc6ec234b91e61f",
    measurementId: "G-5ZEM3S2X79"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Set up an authentication state listener ---
// This function will be called whenever the user's login status changes
// (e.g., they log in, log out, or the page loads and Firebase checks their session)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in. You can now show private content.
        console.log("User is logged in:", user.email || user.uid);
        // You might want to dispatch a custom event here
        // or call a function in your main app logic to update UI
    } else {
        // User is signed out. Show login/registration forms.
        console.log("User is logged out.");
        // You might want to redirect to login page or hide private content
    }
});

console.log("Firebase app and services initialized. Waiting for auth state...");

export { app, auth, db };