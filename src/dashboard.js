
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

 renderCalendar(currentDate);

            // SEMESTER PROGRESS BAR LOGIC
            // NOTE: Ensure you have HTML elements with ids "progressFill" and "progressText"
            // if you want this progress bar to be visible.
            const semesterStart = new Date("2025-02-17");
            const semesterEnd = new Date("2025-06-30");

            // Make sure semesterStart <= today <= semesterEnd
            const totalDays = (semesterEnd - semesterStart) / (1000 * 60 * 60 * 24);
            const daysPassed = (currentDate - semesterStart) / (1000 * 60 * 60 * 24);
            const daysRemaining = Math.ceil((semesterEnd - currentDate) / (1000 * 60 * 60 * 24));

            // Clamp progress between 0% and 100%
            let progressPercent = Math.max(0, Math.min((daysPassed / totalDays) * 100, 100));

            // DOM targets (make sure they exist!)
            const progressFill = document.getElementById("progressFill");
            const progressText = document.getElementById("progressText");

            // Only update if both elements are found
            if (progressFill && progressText) {
                progressFill.style.width = progressPercent.toFixed(2) + "%";
                progressText.textContent = `${progressPercent.toFixed(0)}% complete - ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
            } else {
                console.error("Missing #progressFill or #progressText in HTML for the progress bar.");
            }

