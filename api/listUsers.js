import { apps, initializeApp, credential as _credential, auth } from "firebase-admin";

if (!apps.length) {
  initializeApp({
    credential: _credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

export default async (req, res) => {
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
      const result = await auth().listUsers(1000, nextPageToken);
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