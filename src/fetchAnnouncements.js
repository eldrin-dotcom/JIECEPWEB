// fetchAnnouncements.js

const STRAPI_API = "http://localhost:1337/api/announcements";

/**
 * Build query string for announcements.
 * - Sorts by Published field (custom field, not Strapi built-in)
 * - Filters: Expires is null OR Expires > now
 * - Populates body field (blocks)
 * @param {"asc"|"desc"} sortOrder
 * @returns {string}
 */
function buildQuery(sortOrder = "desc") {
  const nowISO = new Date().toISOString();

  const params = [
    `sort[0]=Published:${sortOrder}`,
    `filters[$or][0][Expires][$null]=true`,
    `filters[$or][1][Expires][$gt]=${nowISO}`,
    `populate=body`
  ];

  return params.join("&");
}

/**
 * Fetches announcements from the Strapi API.
 * @param {"asc"|"desc"} sortOrder
 * @returns {Promise<Array>} Array of announcement objects
 */
export default async function fetchAnnouncements(sortOrder = "desc") {
  const url = `${STRAPI_API}?${buildQuery(sortOrder)}`;
  console.log("Fetching announcements from:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch announcements. Status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.data) return [];

    return data.data.map((item) => ({
      id: item.id,
      title: item.attributes.Title,
      body: item.attributes.body,
      published: item.attributes.Published,
      expires: item.attributes.Expires
    }));
  } catch (err) {
    console.error("Error fetching announcements:", err);
    return [];
  }
}