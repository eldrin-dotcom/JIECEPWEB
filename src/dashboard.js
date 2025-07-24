
document.addEventListener('DOMContentLoaded', function() {
            const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');

      // Update button states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Toggle tab content
      tabContents.forEach(content => {
        if (content.id === `tab-${tab}`) {
          content.classList.remove('d-none');
        } else {
          content.classList.add('d-none');
        }
      });
    });
  });

})
