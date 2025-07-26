// src/content.js
import fetchAnnouncements from './fetchAnnouncements'

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('announcementList')
  const sortSelect = document.getElementById('sortSelect')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const isNew = (publishedAt) => {
    const published = new Date(publishedAt)
    const now = new Date()
    const diffDays = (now - published) / (1000 * 60 * 60 * 24)
    return diffDays <= 7
  }

  const renderAnnouncements = async (sortOrder = 'desc') => {
    list.innerHTML = `<li class="list-group-item text-muted">Loading announcements...</li>`

    const announcements = await fetchAnnouncements(sortOrder)

    if (!announcements.length) {
      list.innerHTML = `<li class="list-group-item text-muted">No announcements available.</li>`
      return
    }

    list.innerHTML = announcements.map(item => {
      const badge = isNew(item.publishedAt)
        ? `<span class="badge bg-primary ms-2">New</span>` : ''

      return `
        <li class="list-group-item">
          <p class="announcement-title mb-1">
            ${item.title} ${badge}
          </p>
         <small class="announcement-date text-muted d-block mb-1">
          ${item.body}
         </small>
         <small class="announcement-date text-muted">
            ${formatDate(item.publishedAt)}
         </small>

        </li>
      `
    }).join('')
  }

  renderAnnouncements('desc')



console.log('👀 Fetching announcements from Sanity...')
})
