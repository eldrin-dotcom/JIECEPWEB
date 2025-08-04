import admin from "firebase-admin";

if (!admin.apps.length) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Missing Firebase environment variables');
  }
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
    res.status(403).json({ error: 'Forbidden: invalid API key' });
    return;
  }
  const { uid, admin: isAdmin } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'Missing UID' });
    return;
  }
  try {
    if (isAdmin === false) {
      // Remove admin claim
      await admin.auth().setCustomUserClaims(uid, {});
      res.status(200).json({ message: `Admin claim removed for user: ${uid}` });
    } else {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      res.status(200).json({ message: `Admin claim set for user: ${uid}` });
    }
  } catch (error) {
    console.error("Error setting custom claims:", error);
    res.status(500).json({ error: error.message || String(error) });
  }
}