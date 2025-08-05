// src/fetchAnnouncements.js

// Strapi API base URL (adjust as needed)
const STRAPI_API = "http://localhost:1337/api/announcements";

// Helper to build query string for sorting and filtering
function buildQuery(sortOrder = "desc") {
  // Strapi v4: sort, filters, and populate params
  const params = new URLSearchParams({
    "sort[0]": `publishedAt:${sortOrder}`,
    "filters[expiresAt][$null]": "true",         // expiresAt is null
    "filters[expiresAt][$gt]": new Date().toISOString() // OR expiresAt > now
  });
  return params.toString();
}

export default async function fetchAnnouncements(sortOrder = "desc") {
  const url = `${STRAPI_API}?${buildQuery(sortOrder)}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    // Strapi v4 returns { data: [ ... ] }
    // Map to match your frontend needs
    return (json.data ?? []).map(item => ({
      id: item.id,
      title: item.attributes.title,
      body: item.attributes.body,
      publishedAt: item.attributes.publishedAt,
      expiresAt: item.attributes.expiresAt
    }));
  } catch (e) {
    console.error("Error fetching announcements:", e);
    return [];
  }
}