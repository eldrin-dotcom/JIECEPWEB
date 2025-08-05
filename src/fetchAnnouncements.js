// fetchAnnouncements.js

const API_URL = "http://localhost:1337/api/announcements";

/**
 * Build a query string for fetching announcements.
 */
function buildQuery() {
  const now = new Date().toISOString();
  const params = [
    `sort[0]=Published:desc`,
    `filters[$or][0][Expires][$null]=true`,
    `filters[$or][1][Expires][$gt]=${now}`,
    `populate=body`
  ];
  return params.join("&");
}

/**
 * Fetch announcements from Strapi.
 * @returns {Promise<Array>} Array of announcement objects
 */
export default async function fetchAnnouncements() {
  const url = `${API_URL}?${buildQuery()}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const json = await res.json();
    return (json.data ?? []).map(item => ({
      id: item.id,
      title: item.attributes.Title,
      body: item.attributes.body,
      published: item.attributes.Published,
      expires: item.attributes.Expires
    }));
  } catch (e) {
    console.error("Error fetching announcements:", e);
    return [];
  }
}