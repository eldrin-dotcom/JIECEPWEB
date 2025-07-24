
import fetchUpcomingEvents from './fetchUpcomingEvents';

const calendarGrid = document.querySelector('.calendar-grid');
const currentMonthYearHeader = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateHeader = document.getElementById('selectedDateHeader');
const calendarDetails = document.getElementById('calendarDetails');
const eventDetailsList = calendarDetails.querySelector('.event-details-list');

let currentDate = new Date();
let calendarEvents = {};

function parseEventsToMap(events) {
const monthNames = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
};

const eventMap = {};
for (const evt of events) {
    const month = monthNames[evt.month.toUpperCase()];
    const date = new Date(new Date().getFullYear(), month, Number(evt.day));
    const dateKey = date.toISOString().split('T')[0];

    if (!eventMap[dateKey]) eventMap[dateKey] = [];
    eventMap[dateKey].push({
    time: evt.dateTimeLocation,
    title: evt.title,
    location: evt.description || evt.category,
    });
}
return eventMap;
}

function renderCalendar(date) {
calendarGrid.querySelectorAll('.calendar-date').forEach(el => el.remove());
eventDetailsList.innerHTML = '';
selectedDateHeader.textContent = '';

const year = date.getFullYear();
const month = date.getMonth();
currentMonthYearHeader.textContent = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

const firstDay = new Date(year, month, 1).getDay();
const daysInMonth = new Date(year, month + 1, 0).getDate();

const today = new Date();
const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

for (let i = 0; i < firstDay; i++) {
    const d = document.createElement('div');
    d.classList.add('calendar-date', 'text-muted');
    d.textContent = '';
    calendarGrid.appendChild(d);
}

for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const d = document.createElement('div');
    d.className = 'calendar-date current-month';
    d.textContent = day;
    d.dataset.date = dateKey;

    if (isCurrentMonth && day === today.getDate()) {
    d.classList.add('today');
    }

    if (calendarEvents[dateKey]) {
    d.classList.add('has-event');
    const dot = document.createElement('div');
    dot.className = 'calendar-event-indicator';
    d.appendChild(dot);
    }

    d.addEventListener('click', () => {
    document.querySelectorAll('.calendar-date.selected').forEach(el => el.classList.remove('selected'));
    d.classList.add('selected');
    displayEventsForDate(dateKey);
    });

    calendarGrid.appendChild(d);
}
}

function displayEventsForDate(dateStr) {
eventDetailsList.innerHTML = '';
selectedDateHeader.textContent = new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const events = calendarEvents[dateStr];
if (!events || events.length === 0) {
    eventDetailsList.innerHTML = '<div class="text-muted text-center py-3">No events for this date.</div>';
    return;
}

events.forEach(event => {
    const e = document.createElement('div');
    e.className = 'calendar-detail-item';
    e.innerHTML = `
    <div class="calendar-detail-time">${event.time}</div>
    <div class="calendar-detail-content">
        <p class="calendar-detail-title mb-0">${event.title}</p>
        <small class="calendar-detail-location d-block text-muted">${event.location}</small>
    </div>
    `;
    eventDetailsList.appendChild(e);
});
}

prevMonthBtn.addEventListener('click', () => {
currentDate.setMonth(currentDate.getMonth() - 1);
renderCalendar(currentDate);
});

nextMonthBtn.addEventListener('click', () => {
currentDate.setMonth(currentDate.getMonth() + 1);
renderCalendar(currentDate);
});

// INIT
(async function () {
const events = await fetchUpcomingEvents();
calendarEvents = parseEventsToMap(events);
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

