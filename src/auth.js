// js/auth.js

// Import auth object from firebase-init.js
import { auth } from "./firebase-init.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

/**
 * Signs up a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with UserCredential on success.
 * @throws {FirebaseError} If signup fails.
 */
async function signUpUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user.email);
        return userCredential;
    } catch (error) {
        console.error("Error signing up:", error);
        // You can add custom error handling logic here based on error.code
        throw new Error(getFirebaseErrorMessage(error.code) || "Sign up failed. Please try again.");
    }
}

/**
 * Signs in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with UserCredential on success.
 * @throws {FirebaseError} If signin fails.
 */
async function signInUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user.email);
        return userCredential;
    } catch (error) {
        console.error("Error signing in:", error);
        throw new Error(getFirebaseErrorMessage(error.code) || "Login failed. Please check your credentials.");
    }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 * @throws {FirebaseError} If sign-out fails.
 */
async function signOutUser() {
    try {
        await signOut(auth);
        console.log("User signed out.");
        // Redirect to the root index.html page after sign out
        window.location.href = "/index.html"; 
    } catch (error) {
        console.error("Error signing out:", error);
        throw new Error(getFirebaseErrorMessage(error.code) || "Sign out failed.");
    }
}

/**
 * Helper function to provide user-friendly Firebase error messages.
 * @param {string} code - Firebase error code.
 * @returns {string} User-friendly error message.
 */
function getFirebaseErrorMessage(code) {
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
        default:
            return 'An authentication error occurred.';
    }
}

export { signUpUser, signInUser, signOutUser };

