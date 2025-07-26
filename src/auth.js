// src/auth.js
// Import auth object from firebase-init.js
import { db } from './firebase-init.js';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from "./firebase-init.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
} from "firebase/auth";

/**
 * Signs up a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with UserCredential on success.
 * @throws {Error} If signup fails.
 */
async function signUpUser(email, password) { // Removed 'export' here
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed up:", user.email);

        
        // Store user in Firestore with default role
        // Note: For actual admin roles, use Firebase Custom Claims via Cloud Functions.
        // This 'role' in Firestore is for general user data/profiles.
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user" // Default role for new sign-ups
        });

        return userCredential;
    } catch (error) {
        console.error("Error signing up:", error);
        // Re-throw the original error to be caught by the calling function (e.g., in index.html)
        // This allows index.html's showMessage to use its own error handling/mapping.
        throw error;
    }
}

/**
 * Signs in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").User>} A promise that resolves with the User object on success.
 * @throws {Error} If signin fails.
 */
async function signInUser(email, password) { // Removed 'export' here
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user.email);
        return userCredential.user; // Return the User object directly
    } catch (error) {
        console.error("Error signing in:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 * @throws {Error} If sign-out fails.
 */
async function signOutUser() { // Removed 'export' here
    try {
        await signOut(auth);
        console.log("User signed out.");
        // DO NOT redirect here. Let onAuthStateChanged listener in index.html handle routing.
    } catch (error) {
        console.error("Error signing out:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The user's email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws {Error} If sending the email fails.
 */
async function sendPasswordReset(email) { // Removed 'export' here
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Helper function to provide user-friendly Firebase error messages.
 * This function will now be used directly by showMessage in index.html for consistency.
 * @param {string} code - Firebase error code.
 * @returns {string} User-friendly error message.
 */
function getFirebaseErrorMessage(code) { // Removed 'export' here
    switch (code) {
        case 'auth/email-already-in-use':
            return 'The email address is already in use by another account.';
        case 'auth/invalid-email':
            return 'The email address is not valid.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please enable them in Firebase Console.';
        case 'auth/weak-password':
            return 'The password is too weak.';
        case 'auth/user-disabled':
            return 'This user account has been disabled.';
        case 'auth/user-not-found':
            return 'No user found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with the same email address but different sign-in credentials. Sign in using your existing method or reset your password.';
        case 'auth/too-many-requests':
            return 'Too many requests. Please try again later.';
        default:
            return 'An authentication error occurred.';
    }
}

// Export all functions
export { signUpUser, signInUser, signOutUser, sendPasswordReset, getFirebaseErrorMessage };
