// src/auth.js
// Import auth object from firebase-init.js
import { db } from './firebase-init.js';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from "./firebase-init.js";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification
} from "firebase/auth";

/**
 * Signs up a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").UserCredential>} A promise that resolves with UserCredential on success.
 * @throws {Error} If signup fails.
 */
async function signUpUser(email, password) {
    try {
        console.log("signUpUser: Attempting to create user with email:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("signUpUser: User signed up successfully. UID:", user.uid, "Email:", user.email);

        // --- Debugging Firestore Write ---
        console.log("signUpUser: Attempting to write user document to Firestore.");
        console.log("signUpUser: db object:", db); // Check if db is defined
        console.log("signUpUser: user.uid:", user.uid); // Check user.uid

         // 2. Send email verification
        console.log("signUpUser: Sending email verification to:", user.email);
        await sendEmailVerification(user);
        console.log("signUpUser: Email verification sent successfully.");

        if (!db) {
            console.error("signUpUser: Firestore 'db' object is undefined!");
            throw new Error("Firestore not initialized correctly.");
        }
        if (!user.uid) {
            console.error("signUpUser: User UID is undefined!");
            throw new Error("User UID missing after signup.");
        }

        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user", // Default role for new sign-ups
            emailVerified: user.emailVerified
        });
        console.log("signUpUser: User document write to Firestore initiated successfully.");

        return userCredential;
    } catch (error) {
        console.error("signUpUser: Error during signup or Firestore write:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Signs in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<import("firebase/auth").User>} A promise that resolves with the User object on success.
 * @throws {Error} If signin fails.
 */
async function signInUser(email, password) {
    try {
        console.log("signInUser: Attempting to sign in user with email:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("signInUser: User signed in successfully. Email:", userCredential.user.email);
        return userCredential.user; // Return the User object directly
    } catch (error) {
        console.error("signInUser: Error during signin:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 * @throws {Error} If sign-out fails.
 */
async function signOutUser() {
    try {
        console.log("signOutUser: Attempting to sign out.");
        await signOut(auth);
        console.log("signOutUser: User signed out.");
    } catch (error) {
        console.error("signOutUser: Error signing out:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The user's email.
 * @returns {Promise<void>} A promise that resolves when the email is sent.
 * @throws {Error} If sending the email fails.
 */
async function sendPasswordReset(email) {
    try {
        console.log("sendPasswordReset: Attempting to send reset email to:", email);
        await sendPasswordResetEmail(auth, email);
        console.log("sendPasswordReset: Password reset email sent.");
    } catch (error) {
        console.error("sendPasswordReset: Error sending password reset email:", error);
        throw error; // Re-throw the original error
    }
}

/**
 * Helper function to provide user-friendly Firebase error messages.
 * @param {string} code - Firebase error code.
 * @returns {string} User-friendly error message.
 */
async function getFirebaseErrorMessage(code) {
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