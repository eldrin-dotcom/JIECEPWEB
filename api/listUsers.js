import * as admin from 'firebase-admin';

// Ensure Firebase is initialized only once
if (!admin.apps || !admin.apps.length) {
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
      nextPageToken = result.pageToken || undefined;
    } while (nextPageToken);

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
}