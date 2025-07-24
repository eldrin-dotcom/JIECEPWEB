// src/eventcontent.js
import { client } from './sanityClient.js'

document.addEventListener('DOMContentLoaded', () => {
  const eventList = document.getElementById('upcoming-events')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  const fetchEvents = async () => {
    const query = `*[_type == "event" && publishedAt <= now() && (!defined(expiresAt) || expiresAt > now())] {
      title,
      day,
      month,
      dateTimeLocation,
      category,
      publishedAt
    }`

    try {
      const events = await client.fetch(query)

      // Sort in ascending order by publishedAt
      events.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))

      return events
    } catch (err) {
      console.error('Error fetching events:', err)
      return []
    }
  }

  const renderEvents = async () => {
    eventList.innerHTML = `<li class="list-group-item text-muted">Loading events...</li>`

    const events = await fetchEvents()

    if (!events.length) {
      eventList.innerHTML = `<li class="list-group-item text-muted">No upcoming events available.</li>`
      return
    }

    eventList.innerHTML = events.map(event => {
      return `
        <li class="list-group-item">
          <p class="event-title mb-1">${event.title}</p>
          <small class="event-date-time text-muted d-block">
            ${event.dateTimeLocation}
          </small>
          <small class="event-date text-muted d-block">
            ${formatDate(event.publishedAt)} | ${event.category}
          </small>
        </li>
      `
    }).join('')
  }

  renderEvents()
})
