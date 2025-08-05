// src/fetchAnnouncements.js

const STRAPI_API = "http://localhost:1337/api/announcements";

// Manually build the query string with proper format and booleans
function buildQuery(sortOrder = "desc") {
  const now = new Date().toISOString();

  return [
    `sort[0]=publishedAt:${sortOrder}`,
    `filters[$or][0][Expires][$null]=true`,
    `filters[$or][1][Expires][$gt]=${now}`,
    `populate=body`
  ].join("&");
}

export default async function fetchAnnouncements(sortOrder = "desc") {
  const url = `${STRAPI_API}?${buildQuery(sortOrder)}`;
  console.log("Fetching announcements from:", url); // Log full URL

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Strapi API request failed with status: ${res.status}`);
    }

    const json = await res.json();

    return (json.data ?? []).map(item => ({
      id: item.id,
      title: item.attributes.Title,       // Title from Strapi
      body: item.attributes.body,         // Rich text body
      published: item.attributes.Published,
      expires: item.attributes.Expires
    }));

  } catch (e) {
    console.error("Error fetching announcements:", e);
    return [];
  }
}
