// src/eventcontent.js
import { client } from './sanityClient.js'

document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('upcoming-events')

  const monthAbbr = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  const fetchEvents = async () => {
    const query = `*[_type == "event" && publishedAt <= now() && (!defined(expiresAt) || expiresAt > now())] {
      title,
      dateTimeLocation,
      category,
      publishedAt
    }`

    try {
      const events = await client.fetch(query)

      // Sort ascending by publishedAt
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
      const date = new Date(event.publishedAt)
      const day = String(date.getDate()).padStart(2, '0')
      const month = monthAbbr[date.getMonth()]

      return `
        <div class="event-item mb-3">
          <div class="event-date-box">
            ${day} <small>${month}</small>
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
