const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

module.exports = async (req, res) => {
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
    await admin.auth().setCustomUserClaims(uid, { admin: isAdmin !== false });
    res.status(200).json({ message: `Admin claim ${isAdmin === false ? 'removed' : 'set'} for user: ${uid}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};