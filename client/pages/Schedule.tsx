import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  MapPin,
  Clock,
  Users,
  X,
  Trash2,
} from "lucide-react";

// The three calendar views the user can switch between
type ViewMode = "month" | "week" | "day";

// Shape of a single event object
interface Event {
  id: number;
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  attendees: number;
}

// Sample events that load when the page first opens
const INITIAL_EVENTS: Event[] = [
  {
    id: 1,
    title: "Practice",
    date: new Date(2025, 2, 6), // March 6, 2025 (months are 0-indexed)
    time: "7:00 PM",
    location: "Main Hall",
    description: "Weekly worship team rehearsal. Come prepared with your parts.",
    attendees: 12,
  },
  {
    id: 2,
    title: "Sunday Service",
    date: new Date(2025, 2, 9),
    time: "10:00 AM",
    location: "Sanctuary",
    description: "Full Sunday morning worship service.",
    attendees: 20,
  },
  {
    id: 3,
    title: "Team Meeting",
    date: new Date(2025, 2, 13),
    time: "6:30 PM",
    location: "Conference Room",
    description: "Monthly team check-in. Discuss upcoming events and prayer requests.",
    attendees: 8,
  },
  {
    id: 4,
    title: "Practice",
    date: new Date(2025, 2, 20),
    time: "7:00 PM",
    location: "Main Hall",
    description: "Weekly worship team rehearsal. Focus on Easter set.",
    attendees: 14,
  },
  {
    id: 5,
    title: "Sunday Service",
    date: new Date(2025, 2, 23),
    time: "10:00 AM",
    location: "Sanctuary",
    description: "Full Sunday morning worship service.",
    attendees: 20,
  },
  {
    id: 6,
    title: "Sunday Service",
    date: new Date(2025, 2, 30),
    time: "10:00 AM",
    location: "Sanctuary",
    description: "Palm Sunday service.",
    attendees: 20,
  },
];

// Used to label calendar columns and day view headers
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Returns true if two Date objects represent the same calendar day
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Filters the events list to only those that fall on a specific day
function getEventsForDay(events: Event[], date: Date): Event[] {
  return events.filter((e) => sameDay(e.date, date));
}

// Returns all 7 days of the week that contains the given date (Sunday to Saturday)
function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay()); // rewind to Sunday
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// Builds the full 6 row grid for a monthly calendar view.
// Includes trailing days from the previous month and leading days from the next
// so the grid always starts on Sunday and ends on Saturday.
function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];
  // Fill in days from the previous month to start on Sunday
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(new Date(year, month, -firstDay.getDay() + i + 1));
  }
  // Fill in all days of the current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  // Pad with days from next month until we have 42 cells (6 full weeks)
  while (days.length < 42) {
    days.push(new Date(year, month + 1, days.length - lastDay.getDate() - firstDay.getDay() + 1));
  }
  return days;
}

// 24-hour labels used in the week and day time-grid views (e.g. "12:00 AM", "1:00 PM")
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 === 0 ? 12 : i % 12;
  return `${h}:00 ${i < 12 ? "AM" : "PM"}`;
});

// Converts a 12-hour time string like "7:00 PM" into a 24-hour number (19)
// Used to position event blocks on the time grid
function parseHour(time: string): number {
  const [hm, period] = time.split(" ");
  let [h] = hm.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return h;
}

// ─── Add Event Modal ──────────────────────────────────────────────────────────
// This ia a props: optional prefill date used when clicking a specific day, close handler, and add handler
interface AddEventModalProps {
  prefillDate?: Date;
  onClose: () => void;
  onAdd: (event: Omit<Event, "id">) => void;
}

// Modal form that appears when the user clicks "Add Event" or "Add to this day"
function AddEventModal({ prefillDate, onClose, onAdd }: AddEventModalProps) {
  const today = prefillDate ?? new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  // Pre fill the date field with the selected day (or today)
  const defaultDate = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Form field state
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("19:00"); // defaults to 7 PM
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState(10);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate required fields before submitting
    if (!title.trim() || !date) {
      setError("Title and date are required.");
      return;
    }
    // Converts the date string and 24 hour time into the Event format
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    const eventDate = new Date(y, m - 1, d);
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    const period = hh < 12 ? "AM" : "PM";
    onAdd({
      title: title.trim(),
      date: eventDate,
      time: `${h12}:${String(mm).padStart(2, "0")} ${period}`,
      location: location.trim() || "TBD",
      description: description.trim(),
      attendees,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        {/* Modal header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900">New Event</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Show validation error if fields are missing */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunday Service"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Date and time sit side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g Main Hall"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What's this event about?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
            />
          </div>

          {/* Slider to pick expected attendee count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Attendees: {attendees}
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={attendees}
              onChange={(e) => setAttendees(Number(e.target.value))}
              className="w-full accent-black"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Event Detail Modal ───────────────────────────────────────────────────────
// Shows full event info when the user clicks "View" or clicks an event on the calendar
interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  onDelete: (id: number) => void;
}

function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        {/* Date badge + close button */}
        <div className="flex items-start justify-between mb-4">
          <div className="bg-gray-900 text-white rounded-xl px-3 py-2 text-center min-w-[52px]">
            <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
              {MONTHS[event.date.getMonth()].slice(0, 3)}
            </div>
            <div className="text-xl font-bold leading-none">{event.date.getDate()}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
            <X size={18} />
          </button>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h2>

        {/* Time, location, and attendee count */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={15} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={15} />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={15} />
            <span>{event.attendees} attendees</span>
          </div>
        </div>

        {/* Only show description if one was provided */}
        {event.description && (
          <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 mb-4">
            {event.description}
          </p>
        )}

        {/* Delete button — removes the event and closes the modal */}
        <button
          onClick={() => { onDelete(event.id); onClose(); }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition"
        >
          <Trash2 size={15} />
          Delete Event
        </button>
      </div>
    </div>
  );
}

// ─── Week View ────────────────────────────────────────────────────────────────
// Shows a 7-day time grid. Events are positioned absolutely based on their hour.
function WeekView({
  currentDate,
  events,
  today,
  onEventClick,
  onDayClick,
}: {
  currentDate: Date;
  events: Event[];
  today: Date;
  onEventClick: (e: Event) => void;
  onDayClick: (d: Date) => void;
}) {
  // Get all 7 days for the week that contains currentDate
  const weekDays = getWeekDays(currentDate);

  return (
    <div className="overflow-auto">
      {/* Sticky row of day headers (Sun, Mon, ...) with their date numbers */}
      <div className="grid grid-cols-8 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="py-3" /> {/* empty cell above the time labels column */}
        {weekDays.map((day, i) => (
          <button
            key={i}
            onClick={() => onDayClick(day)} // clicking a day header switches to day view
            className="py-3 text-center group"
          >
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              {DAYS_OF_WEEK[day.getDay()]}
            </div>
            <div
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition ${
                sameDay(day, today)
                  ? "bg-black text-white"
                  : "text-gray-700 group-hover:bg-gray-100"
              }`}
            >
              {day.getDate()}
            </div>
          </button>
        ))}
      </div>

      {/* Time grid: first column = hour labels, remaining 7 columns = one per day */}
      <div className="grid grid-cols-8" style={{ minHeight: "600px" }}>
        {/* Hour labels on the left */}
        <div className="border-r border-gray-100">
          {HOURS.map((h) => (
            <div key={h} className="h-14 flex items-start pt-1 pr-2 justify-end">
              <span className="text-xs text-gray-400">{h}</span>
            </div>
          ))}
        </div>

        {/* One column per day — events are overlaid using absolute positioning */}
        {weekDays.map((day, di) => {
          const dayEvents = getEventsForDay(events, day);
          return (
            <div key={di} className="border-r border-gray-100 relative">
              {/* Hour-row dividers (purely visual) */}
              {HOURS.map((_, hi) => (
                <div key={hi} className="h-14 border-b border-gray-50" />
              ))}
              {/* Each event is placed at top = hour * row height (56px) */}
              {dayEvents.map((event) => {
                const hour = parseHour(event.time);
                return (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    style={{ top: `${hour * 56}px` }}
                    className="absolute left-1 right-1 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg text-left hover:bg-gray-700 transition z-10"
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="opacity-70">{event.time}</div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Day View ─────────────────────────────────────────────────────────────────
// Shows a single day as a 24-hour time grid with events positioned by hour
function DayView({
  currentDate,
  events,
  today,
  onEventClick,
}: {
  currentDate: Date;
  events: Event[];
  today: Date;
  onEventClick: (e: Event) => void;
}) {
  const dayEvents = getEventsForDay(events, currentDate);
  const isToday = sameDay(currentDate, today);

  return (
    <div className="overflow-auto">
      {/* Day header showing the full date and event count */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold ${
            isToday ? "bg-black text-white" : "bg-gray-100 text-gray-700"
          }`}
        >
          {currentDate.getDate()}
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {DAYS_OF_WEEK[currentDate.getDay()]}, {MONTHS[currentDate.getMonth()]} {currentDate.getDate()}
          </div>
          <div className="text-xs text-gray-400">{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {/* Two-column grid: hour labels on the left, events on the right */}
      <div className="grid grid-cols-[80px_1fr]" style={{ minHeight: "600px" }}>
        {/* Hour labels */}
        <div className="border-r border-gray-100">
          {HOURS.map((h) => (
            <div key={h} className="h-14 flex items-start pt-1 px-2 justify-end">
              <span className="text-xs text-gray-400">{h}</span>
            </div>
          ))}
        </div>

        {/* Events column — uses absolute positioning just like WeekView */}
        <div className="relative">
          {HOURS.map((_, hi) => (
            <div key={hi} className="h-14 border-b border-gray-50" />
          ))}
          {dayEvents.map((event) => {
            const hour = parseHour(event.time);
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                style={{ top: `${hour * 56}px` }}
                className="absolute left-2 right-2 bg-gray-900 text-white px-3 py-2 rounded-xl text-left hover:bg-gray-700 transition z-10"
              >
                <div className="font-semibold text-sm">{event.title}</div>
                <div className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                  <Clock size={11} /> {event.time} · <MapPin size={11} /> {event.location}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Schedule Component ──────────────────────────────────────────────────
export default function Schedule() {
  const today = new Date();

  // currentDate drives which month/week/day is being displayed on the calendar
  const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1));
  const [viewMode, setViewMode] = useState<ViewMode>("month");

  // Full list of events — add and delete update this array
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  // When a day is selected in month view, the bottom list filters to that day
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Controls whether the Add Event modal is open
  const [showAddModal, setShowAddModal] = useState(false);
  // Optional prefill date passed into the modal (e.g. when clicking a specific day)
  const [addPrefillDate, setAddPrefillDate] = useState<Date | undefined>(undefined);

  // The event whose detail modal is currently open (null = closed)
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = getDaysInMonth(year, month); // all 42 cells for the month grid

  // Adds a new event to the list using Date.now() as a unique ID
  function addEvent(data: Omit<Event, "id">) {
    setEvents((prev) => [...prev, { ...data, id: Date.now() }]);
  }

  // Removes an event by ID; clears selectedDay if no events remain on that day
  function deleteEvent(id: number) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (selectedDay && getEventsForDay(events.filter((e) => e.id !== id), selectedDay).length === 0) {
      setSelectedDay(null);
    }
  }

  // Clicking a day in month view selects it (clicking again deselects it)
  // In week/day view, clicking a day navigates to day view for that date
  function handleDayClick(day: Date) {
    setSelectedDay((prev) => (prev && sameDay(prev, day) ? null : day));
    if (viewMode !== "month") {
      setCurrentDate(day);
      setViewMode("day");
    }
  }

  // Opens the Add Event modal, optionally pre-filling a date
  function openAddModal(prefill?: Date) {
    setAddPrefillDate(prefill);
    setShowAddModal(true);
  }

  // Moves the calendar forward or backward by 1 month/week/day depending on the view
  function navigate(dir: -1 | 1) {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + dir, 1));
    } else if (viewMode === "week") {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + dir * 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + dir);
      setCurrentDate(d);
    }
    setSelectedDay(null);
  }

  // Export is disabled — function kept but button won't call it
  function exportEvents() {
    const lines = [
      "Title,Date,Time,Location,Description,Attendees",
      ...events.map((e) =>
        [
          `"${e.title}"`,
          `"${MONTHS[e.date.getMonth()]} ${e.date.getDate()}, ${e.date.getFullYear()}"`,
          `"${e.time}"`,
          `"${e.location}"`,
          `"${e.description}"`,
          e.attendees,
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Bottom event list shows either the selected day's events or all upcoming events this month
  const filteredEvents = selectedDay
    ? getEventsForDay(events, selectedDay)
    : [...events]
        .filter((e) => e.date >= new Date(year, month, 1))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Builds the text label shown in the calendar toolbar
  const headerLabel = () => {
    if (viewMode === "month") return `${MONTHS[month]} ${year}`;
    if (viewMode === "week") {
      const week = getWeekDays(currentDate);
      return `${MONTHS[week[0].getMonth()]} ${week[0].getDate()} – ${MONTHS[week[6].getMonth()]} ${week[6].getDate()}, ${week[6].getFullYear()}`;
    }
    return `${DAYS_OF_WEEK[currentDate.getDay()]}, ${MONTHS[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Modals — only one renders at a time */}
      {showAddModal && (
        <AddEventModal
          prefillDate={addPrefillDate}
          onClose={() => setShowAddModal(false)}
          onAdd={addEvent}
        />
      )}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDelete={deleteEvent}
        />
      )}

      {/* Page header with title and action buttons */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage team events</p>
        </div>
        <div className="flex gap-3">
          {/* Export is disabled — not yet implemented */}
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed opacity-50"
            disabled
          >
            <Download size={16} />
            Export
          </button>
          {/* Opens the Add Event modal, pre-filling the selected day if one is active */}
          <button
            onClick={() => openAddModal(selectedDay ?? undefined)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
          >
            <Plus size={16} />
            Add Event
          </button>
        </div>
      </div>

      {/* ── Calendar card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
        {/* Toolbar: prev/next navigation, date label, Today button, and view toggle */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 min-w-[220px] text-center">
              {headerLabel()}
            </h2>
            <button
              onClick={() => navigate(1)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition"
            >
              <ChevronRight size={18} />
            </button>
            {/* Today button jumps back to the current month in month view */}
            <button
              onClick={() => { setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)); setViewMode("month"); setSelectedDay(null); }}
              className="ml-2 text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Today
            </button>
          </div>

          {/* Switch between Month, Week, and Day views */}
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            {(["month", "week", "day"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => { setViewMode(v); setSelectedDay(null); }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                  viewMode === v
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* ── Month view: 7-column grid of days ── */}
        {viewMode === "month" && (
          <>
            {/* Day-of-week header row */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* 42-cell grid (6 weeks × 7 days) */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const isCurrentMonth = day.getMonth() === month; // dim days outside this month
                const isToday = sameDay(day, today);
                const isSelected = selectedDay && sameDay(day, selectedDay);
                const dayEvents = getEventsForDay(events, day);
                const isLastRow = idx >= 35; // don't draw bottom border on the last row

                return (
                  <button
                    key={idx}
                    onClick={() => handleDayClick(day)} // select this day
                    className={`min-h-[96px] p-2 border-b border-r border-gray-100 text-left transition ${
                      isLastRow ? "border-b-0" : ""
                    } ${idx % 7 === 6 ? "border-r-0" : ""} ${
                      isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Day number circle — black if today, blue if selected */}
                    <div className="mb-1">
                      <span
                        className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                          isToday
                            ? "bg-black text-white"
                            : isSelected
                            ? "bg-blue-600 text-white"
                            : isCurrentMonth
                            ? "text-gray-900"
                            : "text-gray-300"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                    {/* Show up to 2 event tags; overflow shown as "+N more" */}
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); setDetailEvent(event); }} // open detail without selecting day
                          className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded truncate font-medium hover:bg-gray-700 transition cursor-pointer"
                        >
                          {event.title} {event.time.split(":")[0]}{event.time.includes("PM") ? "PM" : "AM"}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-400 px-1">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── Week view: 7-column hourly time grid ── */}
        {viewMode === "week" && (
          <WeekView
            currentDate={currentDate}
            events={events}
            today={today}
            onEventClick={setDetailEvent}
            onDayClick={handleDayClick}
          />
        )}

        {/* ── Day view: single-day hourly time grid ── */}
        {viewMode === "day" && (
          <DayView
            currentDate={currentDate}
            events={events}
            today={today}
            onEventClick={setDetailEvent}
          />
        )}
      </div>

      {/* ── Upcoming / Selected Events list ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          {/* Title changes to show the selected date when a day is active */}
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedDay
              ? `${MONTHS[selectedDay.getMonth()]} ${selectedDay.getDate()} — Events`
              : "Upcoming Events"}
          </h2>
          {/* Show quick-add and clear buttons when a day is selected */}
          {selectedDay && (
            <div className="flex gap-2">
              <button
                onClick={() => openAddModal(selectedDay)}
                className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-1"
              >
                <Plus size={12} /> Add to this day
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Empty state with a quick "Add one" link */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No events {selectedDay ? "on this day" : "this month"}.</p>
            <button
              onClick={() => openAddModal(selectedDay ?? undefined)}
              className="mt-3 text-sm font-medium text-gray-700 underline hover:text-gray-900"
            >
              Add one
            </button>
          </div>
        ) : (
          // Responsive card grid — 1 col on mobile, 2 on sm, 3 on lg
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3"
              >
                {/* Date badge (top-left) + View button (top-right) */}
                <div className="flex items-start justify-between">
                  <div className="bg-gray-900 text-white rounded-xl px-3 py-2 text-center min-w-[52px]">
                    <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                      {MONTHS[event.date.getMonth()].slice(0, 3)}
                    </div>
                    <div className="text-xl font-bold leading-none">{event.date.getDate()}</div>
                  </div>
                  {/* Opens the detail modal for this event */}
                  <button
                    onClick={() => setDetailEvent(event)}
                    className="text-xs font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition"
                  >
                    View
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 text-base">{event.title}</h3>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{event.time}</span>
                  <span className="text-gray-300">·</span>
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>

                {/* Truncate long descriptions to 2 lines */}
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{event.description}</p>

                {/* Attendee avatars + count */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(event.attendees, 3) }).map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                        <Users size={10} className="text-gray-500" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{event.attendees} attendees</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
