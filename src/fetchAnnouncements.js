// src/fetchAnnouncements.js

// Strapi API base URL (adjust as needed)
const STRAPI_API = "http://localhost:1337/api/announcements";

// Helper to build query string for sorting, filtering, and populating
function buildQuery(sortOrder = "desc") {
  // Strapi v4: sort, filters, and populate params
  const params = {
    // Correctly sort by the auto-generated publishedAt field
    "sort[0]": `publishedAt:${sortOrder}`,

    // Use Strapi's $or operator for the logical OR condition
    // This correctly filters for announcements that have no expiration date
    // OR have an expiration date in the future.
    "filters[$or][0][Expires][$null]": "true",
    "filters[$or][1][Expires][$gt]": new Date().toISOString(),

    // The 'blocks' field type (rich text) is not populated by default.
    // We need to explicitly request it with the populate parameter.
    "populate[0]": "body",
  };

  const urlParams = new URLSearchParams();
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      urlParams.append(key, params[key]);
    }
  }
  return urlParams.toString();
}

export default async function fetchAnnouncements(sortOrder = "desc") {
  const url = `${STRAPI_API}?${buildQuery(sortOrder)}`;
  console.log("Fetching announcements from:", url); // Log the full URL for debugging
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Strapi API request failed with status: ${res.status}`);
    }
    const json = await res.json();
    
    // Strapi v4 returns { data: [ ... ] }
    // Map to match your frontend needs, converting field names to camelCase
    return (json.data ?? []).map(item => ({
      id: item.id,
      title: item.attributes.Title, // Use uppercase Title as per your schema
      body: item.attributes.body,
      published: item.attributes.Published, // Use uppercase Published
      expires: item.attributes.Expires // Use uppercase Expires
    }));
  } catch (e) {
    console.error("Error fetching announcements:", e);
    return [];
  }
}
