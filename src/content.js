import fetchAnnouncements from './fetchAnnouncements.js';

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('announcementList');
  const sortSelect = document.getElementById('sortSelect');

  /**
   * Helper function to format a date string.
   * @param {string} dateString The date to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No date provided';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  /**
   * Helper function to check if an announcement is new (published in the last 7 days).
   * @param {string} publishedAt The publication date of the announcement.
   * @returns {boolean} True if the announcement is new, false otherwise.
   */
  const isNew = (publishedAt) => {
    if (!publishedAt) return false;
    const published = new Date(publishedAt);
    const now = new Date();
    const diffDays = (now - published) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  };

  /**
   * Renders the Strapi 'blocks' rich text field into HTML.
   * This function handles simple paragraphs and text formatting.
   * For more complex blocks (like lists, images, etc.), you would need to add more cases.
   * @param {Array} blocks The array of rich text blocks from the Strapi API.
   * @returns {string} The HTML string representation of the blocks.
   */
  const renderBlocks = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) {
      return '';
    }

    // Map each block object to its corresponding HTML element
    return blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          // For a paragraph, iterate through its children to handle text and formatting
          const paragraphContent = block.children.map(child => {
            let text = child.text;
            if (child.bold) text = `<b>${text}</b>`;
            if (child.italic) text = `<i>${text}</i>`;
            if (child.underline) text = `<u>${text}</u>`;
            if (child.strikethrough) text = `<s>${text}</s>`;
            return text;
          }).join('');
          return `<p class="mb-1">${paragraphContent}</p>`;
        case 'heading':
          // Handle headings with different levels
          return `<h${block.level} class="mt-2 mb-1">${block.children[0].text}</h${block.level}>`;
        case 'list':
          // Handle lists (ordered and unordered)
          const listType = block.format === 'ordered' ? 'ol' : 'ul';
          const listItems = block.children.map(listItem => {
            const itemText = listItem.children.map(child => child.text).join('');
            return `<li>${itemText}</li>`;
          }).join('');
          return `<${listType} class="mb-1">${listItems}</${listType}>`;
        default:
          // Fallback for unsupported block types
          return '';
      }
    }).join('');
  };

  /**
   * Renders the list of announcements.
   * @param {string} sortOrder The sort order for the announcements.
   */
  const renderAnnouncements = async (sortOrder = 'desc') => {
    list.innerHTML = `<li class="list-group-item text-muted">Loading announcements...</li>`;

    // The fetchAnnouncements function is now using `item.attributes.Published` and `item.attributes.Expires`
    // so we can reference them directly on the mapped object.
    const announcements = await fetchAnnouncements(sortOrder);

    if (!announcements.length) {
      list.innerHTML = `<li class="list-group-item text-muted">No announcements available.</li>`;
      return;
    }

    list.innerHTML = announcements.map(item => {
      const badge = isNew(item.published) ? `<span class="badge bg-primary ms-2">New</span>` : '';
      const bodyContent = renderBlocks(item.body);

      return `
        <li class="list-group-item">
          <p class="announcement-title mb-1">
            ${item.title} ${badge}
          </p>
          <div class="announcement-body text-muted">
            ${bodyContent}
          </div>
          <small class="announcement-date text-muted mt-1 d-block">
            Published: ${formatDate(item.published)}
          </small>
        </li>
      `;
    }).join('');
  };

  // Initial render
  renderAnnouncements('desc');
});
