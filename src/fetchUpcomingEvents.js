// src/fetchUpcomingEvents.js
import { client } from './sanityClient';

export default async function fetchUpcomingEvents() {
  const now = new Date().toISOString();

  const query = `*[_type == "event" && publishedAt <= now() && (!defined(expiresAt) || expiresAt > now())] | order(publishedAt desc) {
    title,
    day,
    month,
    dateTimeLocation,
    category
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return null;
  }
}
