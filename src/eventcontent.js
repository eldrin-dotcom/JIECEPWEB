import fetchUpcomingEvents from './fetchUpcomingEvents.js';

export default async function renderUpcomingEvents(containerId = 'upcoming-events') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const data = await fetchUpcomingEvents();

  if (!data || !data.events || data.events.length === 0) {
    container.innerHTML = '<p>No upcoming events found.</p>';
    return;
  }

  container.innerHTML = ''; // Clear previous content

  data.events.forEach(event => {
    const item = document.createElement('div');
    item.className = 'event-item';
    item.innerHTML = `
      <div class="event-date-box">
        ${event.day} <small>${event.month}</small>
      </div>
      <div class="event-content">
        <p class="event-title mb-1">${event.title}</p>
        <small class="event-date-time text-muted">${event.dateTimeLocation}</small>
        <small class="event-location d-block">${event.category}</small>
      </div>
    `;
    container.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderUpcomingEvents();
});
