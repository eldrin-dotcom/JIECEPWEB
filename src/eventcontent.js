// src/eventcontent.js
import { client } from './sanityClient.js'

document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('upcoming-events')

  const fetchEvents = async () => {
    // Modified query: include 'day' and 'month' directly from the schema
    const query = `*[_type == "event" && publishedAt > now()] {
      title,
      dateTimeLocation,
      category,
      publishedAt,
      day,  // Include the 'day' field from your schema
      month // Include the 'month' field from your schema
    }`

    try {
      const events = await client.fetch(query)

      // Sort ascending by publishedAt to show the soonest events first.
      // This is still good practice to ensure temporal order, even if day/month are separate fields.
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
      // No need to create a Date object or use monthAbbr here for display
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