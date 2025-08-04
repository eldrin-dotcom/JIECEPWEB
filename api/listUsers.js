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
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (req.headers['x-api-key'] !== process.env.ADMIN_API_KEY) {
    res.status(403).json({ error: 'Forbidden: invalid API key' });
    return;
  }

  try {
    let users = [];
    let nextPageToken = undefined;
    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      users = users.concat(result.users.map(u => ({
        uid: u.uid,
        email: u.email,
        admin: u.customClaims?.admin === true
      })));
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};