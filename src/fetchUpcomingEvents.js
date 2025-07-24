import { client } from './sanityClient';

export default async function fetchUpcomingEvents() {
  const query = `*[_type == "upcomingEventsSection"][0] {
    title,
    events[] {
      day,
      month,
      title,
      dateTimeLocation,
      category
    }
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return null;
  }
}
