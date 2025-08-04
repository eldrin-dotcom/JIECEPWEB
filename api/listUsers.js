import pkg from 'firebase-admin';
const { apps, initializeApp, credential: _credential, auth } = pkg;

if (!apps.length) {
  const credentials = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Ensure this key is correctly formatted with newlines
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  };

  // Log the credentials to the console for debugging
  console.log('Firebase Credentials:', credentials);

  // Check that the credential object and its cert method exist
  if (!_credential || typeof _credential.cert !== 'function') {
    console.error('Firebase Admin SDK credential object is not available.');
    // Exit gracefully to prevent a crash
    return;
  }

  initializeApp({
    credential: _credential.cert(credentials)
  });
}

// ... your endpoint code
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