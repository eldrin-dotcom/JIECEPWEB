// src/eventcontent.js
import { client } from './sanityClient.js'

document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('upcoming-events')

  // monthAbbr array is still not needed if 'month' from schema is already e.g., "JAN", "FEB"

  const fetchEvents = async () => {
    // Reverting to the original more comprehensive query filter for "active/unexpired" events
    const query = `*[_type == "event" && publishedAt <= now() && (!defined(expiresAt) || expiresAt > now())] {
      title,
      dateTimeLocation,
      category,
      publishedAt,
      day,   // Include the 'day' field from your schema
      month  // Include the 'month' field from your schema
    }`

    try {
      const events = await client.fetch(query)
      console.log('Events fetched from Sanity:', events); // KEEP THIS FOR DEBUGGING!

      // Sort ascending by publishedAt (or you could sort by event actual date if you added an eventDate field)
      events.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))

      return events
    } catch (err) {
      console.error('Error fetching events:', err)
      return []
    }
  }

  const renderEvents = async () => {
    eventList.innerHTML = `<div class="text-muted">Loading events...</div>`

    const events = await fetchEvents()

    if (!events.length) {
      eventList.innerHTML = `<div class="text-muted">No upcoming events available.</div>`
      return
    }

    eventList.innerHTML = events.map(event => {
      // Directly use event.day and event.month from the fetched data
      return `
        <div class="event-item mb-3">
          <div class="event-date-box">
            ${event.day} <small>${event.month}</small>
          </div>
          <div class="event-content">
            <p class="event-title mb-1">${event.title}</p>
            <small class="event-date-time text-muted">${event.dateTimeLocation}</small>
            <small class="event-location d-block">${event.category}</small>
          </div>
        </div>
      `
    }).join('')
  }

  renderEvents()
})