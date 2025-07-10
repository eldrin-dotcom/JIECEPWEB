// src/fetchAnnouncements.js
import { client } from './sanityClient';

// Add sortOrder parameter with a default value
export default async function fetchAnnouncements(sortOrder = 'desc') {
  // Determine the correct order string for GROQ
  const orderString = sortOrder === 'asc' ? 'publishedAt asc' : 'publishedAt desc';

  const query = `*[_type == "announcement" && (!defined(expiresAt) || expiresAt > now())] | order(${orderString}){
    _id,
    title,
    body,
    publishedAt
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}