// src/sanityClient.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'vsql81qd',         // ✅ Your project ID
  dataset: 'staging',            // ✅ Your dataset name
  apiVersion: '2023-01-01',      // ✅ Use the same version everywhere
  useCdn: true,                  // ✅ Use CDN for public/readonly queries
});

