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

            // Calendar Functionality
            const calendarGrid = document.querySelector('.calendar-grid');
            const currentMonthYearHeader = document.getElementById('currentMonthYear');
            const prevMonthBtn = document.getElementById('prevMonth');
            const nextMonthBtn = document.getElementById('nextMonth');
            const selectedDateHeader = document.getElementById('selectedDateHeader');
            const calendarDetails = document.getElementById('calendarDetails');
            const eventDetailsList = calendarDetails.querySelector('.event-details-list');

            let currentDate = new Date(); // Start with current month and year

            // Dummy Event Data (for demo purposes)
            const dummyEvents = {
                '2023-12-05': [
                    { time: '8:00 PM', title: 'Engineering Showcase', location: 'Engineering Building Atrium' }
                ],
                '2023-12-08': [
                    { time: '10:00 AM', title: 'Tech Industry Career Fair', location: 'Student Union' }
                ],
                '2023-12-12': [
                    { time: '4:00 PM', title: 'Robotics Workshop', location: 'Lab 204' }
                ],
                '2023-12-15': [
                    { time: 'ALL DAY', title: 'Registration Deadline', location: 'Last day to register for spring semester courses' },
                    { time: '3:00 PM', title: 'Senior Design Meeting', location: 'Room 305, Engineering Building' }
                ],
                '2024-01-01': [
                    { time: 'ALL DAY', title: 'New Year\'s Day', location: 'Holiday' }
                ]
            };


            function renderCalendar(date) {
                calendarGrid.innerHTML = ''; // Clear previous dates
                eventDetailsList.innerHTML = ''; // Clear event details
                selectedDateHeader.textContent = ''; // Clear selected date header

                // Add day names
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                dayNames.forEach(day => {
                    const dayNameDiv = document.createElement('div');
                    dayNameDiv.classList.add('calendar-day-name');
                    dayNameDiv.textContent = day;
                    calendarGrid.appendChild(dayNameDiv);
                });

                const year = date.getFullYear();
                const month = date.getMonth(); // 0-indexed
                currentMonthYearHeader.textContent = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

                const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
                const daysInMonth = new Date(year, month + 1, 0).getDate(); // Last day of current month

                // Days from previous month
                const prevMonthDays = new Date(year, month, 0).getDate();
                for (let i = firstDayOfMonth; i > 0; i--) {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('calendar-date', 'text-muted');
                    dayDiv.textContent = prevMonthDays - i + 1;
                    calendarGrid.appendChild(dayDiv);
                }

                // Current month days
                for (let i = 1; i <= daysInMonth; i++) {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('calendar-date', 'current-month');
                    dayDiv.textContent = i;
                    dayDiv.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

                    // Highlight today
                    const today = new Date();
                    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                        dayDiv.classList.add('today');
                    }

                    // Add event indicator if there are events
                    const dateString = dayDiv.dataset.date;
                    if (dummyEvents[dateString]) {
                        dayDiv.classList.add('has-event');
                        const indicator = document.createElement('div');
                        indicator.classList.add('calendar-event-indicator');
                        dayDiv.appendChild(indicator);
                    }

                    dayDiv.addEventListener('click', function() {
                        // Remove 'selected' class from previously selected day
                        const currentSelected = document.querySelector('.calendar-date.selected');
                        if (currentSelected) {
                            currentSelected.classList.remove('selected');
                        }
                        this.classList.add('selected'); // Add 'selected' to clicked day

                        displayEventsForDate(this.dataset.date);
                    });
                    calendarGrid.appendChild(dayDiv);
                }

                // Days from next month (fill up to 6 weeks)
                const totalCells = calendarGrid.children.length - dayNames.length;
                let nextMonthDay = 1;
                while ((totalCells + nextMonthDay - 1) % 7 !== 0 || nextMonthDay === 1) { // Ensure full weeks are displayed
                    if (totalCells + nextMonthDay -1 >= 42) break; // Limit to 6 rows (42 days total)

                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('calendar-date', 'text-muted');
                    dayDiv.textContent = nextMonthDay;
                    calendarGrid.appendChild(dayDiv);
                    nextMonthDay++;
                }

                // Initially display events for the current day if it's in the current month view
                const todayFormatted = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                if (month === currentDate.getMonth() && year === currentDate.getFullYear()) {
                    displayEventsForDate(todayFormatted);
                    const todayCell = document.querySelector(`.calendar-date.today`);
                    if (todayCell) {
                        todayCell.classList.add('selected'); // Mark today as selected
                    }
                } else {
                    // If not viewing current month, select the first day with an event, or the 1st
                    const firstDayWithEvent = Object.keys(dummyEvents).find(eventDate => {
                        const [eventYear, eventMonth, eventDay] = eventDate.split('-').map(Number);
                        return eventYear === year && eventMonth === (month + 1);
                    });

                    if (firstDayWithEvent) {
                        displayEventsForDate(firstDayWithEvent);
                        const dayCell = document.querySelector(`[data-date="${firstDayWithEvent}"]`);
                        if (dayCell) {
                            dayCell.classList.add('selected');
                        }
                    } else if (daysInMonth > 0) {
                        // If no events in the month, display events for the 1st day (empty usually)
                        const firstDayOfMonthFormatted = `${year}-${String(month + 1).padStart(2, '0')}-01`;
                        displayEventsForDate(firstDayOfMonthFormatted);
                        const dayCell = document.querySelector(`[data-date="${firstDayOfMonthFormatted}"]`);
                        if (dayCell) {
                            dayCell.classList.add('selected');
                        }
                    }
                }
            }

            function displayEventsForDate(dateString) {
                eventDetailsList.innerHTML = ''; // Clear previous events
                selectedDateHeader.textContent = new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

                const events = dummyEvents[dateString];
                if (events && events.length > 0) {
                    events.forEach(event => {
                        const eventItem = document.createElement('div');
                        eventItem.classList.add('calendar-detail-item');
                        eventItem.innerHTML = `
                            <div class="calendar-detail-time">${event.time}</div>
                            <div class="calendar-detail-content">
                                <p class="calendar-detail-title mb-0">${event.title}</p>
                                <small class="calendar-detail-location d-block text-muted">
                                    ${event.location}
                                </small>
                            </div>
                        `;
                        eventDetailsList.appendChild(eventItem);
                    });
                } else {
                    eventDetailsList.innerHTML = '<div class="text-muted text-center py-3">No events for this date.</div>';
                }
            }

            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar(currentDate);
            });

            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar(currentDate);
            });

            // Initial render
            renderCalendar(currentDate);

            // SEMESTER PROGRESS BAR LOGIC
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
                console.error("Missing #progressFill or #progressText in HTML.");
            }


        });