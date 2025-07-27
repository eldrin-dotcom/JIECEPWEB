// functions/index.js (This file goes in your Firebase Cloud Functions directory)

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
// If you're deploying to Cloud Functions, this is usually sufficient.
// If running locally or on your own server, you might need to provide service account credentials:
// admin.initializeApp({
//   credential: admin.credential.cert(require("./path/to/your/serviceAccountKey.json"))
// });
admin.initializeApp();

/**
 * Cloud Function to set a user's custom claim to "admin: true".
 * This function should only be callable by existing administrators.
 *
 * @param {object} data - The data sent from the client.
 * @param {string} data.email - The email of the user to make an admin.
 * @param {object} context - The context of the callable function call.
 * @param {object} context.auth - Authentication information of the caller.
 * @param {string} context.auth.uid - The UID of the user making the request.
 */
exports.makeAdmin = functions.https.onCall(async (data, context) => {
    // 1. Check if the caller is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "Only authenticated users can make this request.",
        );
    }

    // 2. (Crucial Security Check) Verify if the caller themselves is an admin.
    //    This prevents non-admins from granting admin roles.
    const callerUid = context.auth.uid;
    let callerUserRecord;
    try {
        callerUserRecord = await admin.auth().getUser(callerUid);
    } catch (error) {
        throw new functions.https.HttpsError(
            "internal",
            "Failed to retrieve caller user record.",
            error.message,
        );
    }

    // Check if the caller has the "admin" custom claim set to true
    if (!callerUserRecord.customClaims || callerUserRecord.customClaims.admin !== true) {
        throw new functions.https.HttpsError(
            "permission-denied",
            "Only administrators can grant admin roles.",
        );
    }

    // 3. Validate input: Get the target user's email from the request data
    const targetEmail = data.email;
    if (!targetEmail || typeof targetEmail !== "string") {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "The target user's email is required and must be a string.",
        );
    }

    // 4. Get the target user's record by email
    let targetUserRecord;
    try {
        targetUserRecord = await admin.auth().getUserByEmail(targetEmail);
    } catch (error) {
        throw new functions.https.HttpsError(
            "not-found",
            `User with email ${targetEmail} not found.`,
        );
    }

    // 5. Set the custom claim for the target user
    const customClaims = {
        admin: true,
        // You can add other claims here if needed, e.g., "level": 10,
    };

    try {
        await admin.auth().setCustomUserClaims(targetUserRecord.uid, customClaims);

        // Optional: Trigger a token refresh on the client side.
        // This is often done by setting a metadata field that the client listens to,
        // or by simply telling the client to call getIdTokenResult(true) after a successful call.
        // For simplicity in this example, we'll rely on the client explicitly refreshing.

        return { message: `User ${targetEmail} (${targetUserRecord.uid}) is now an administrator.` };
    } catch (error) {
        console.error("Error setting custom claims:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to set admin claims.",
            error.message,
        );
    }
});
