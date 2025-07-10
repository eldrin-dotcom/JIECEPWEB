// src/sanityClient.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '22b59vd4',         // ✅ Your project ID
  dataset: 'production',            // ✅ Your dataset name
  apiVersion: '2023-01-01',      // ✅ Use the same version everywhere
  useCdn: true,                  // ✅ Use CDN for public/readonly queries
});

