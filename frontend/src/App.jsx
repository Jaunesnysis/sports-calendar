import { useEffect, useState } from "react";
import "./App.css";

function formatDate(datetime) {
  const date = new Date(datetime);
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">SportsCal</div>
      <div className="navbar-links">
        <a href="#">Home</a>
        <a href="#">Schedule</a>
        <a href="#">Teams</a>
        <a href="#">Venues</a>
      </div>
    </nav>
  );
}

function EventCard({ event }) {
  return (
    <div className="event-card">
      <div className="event-sport">{event.sport}</div>
      <div className="event-teams">
        {event.home_team} vs {event.away_team}
      </div>
      <div className="event-details">
        <span>{formatDate(event.event_datetime)}</span>
        {event.venue && (
          <span>
            {event.venue}, {event.venue_city}
          </span>
        )}
      </div>
      <div className={`event-status status-${event.status}`}>
        {event.status}
      </div>
    </div>
  );
}

function Filters({ events, onFilter }) {
  const [sport, setSport] = useState("");
  const [date, setDate] = useState("");

  const sports = [...new Set(events.map((e) => e.sport))];

  useEffect(() => {
    let filtered = events;
    if (sport) filtered = filtered.filter((e) => e.sport === sport);
    if (date)
      filtered = filtered.filter((e) => e.event_datetime.startsWith(date));
    onFilter(filtered);
  }, [sport, date, events]);

  return (
    <div className="filters">
      <select value={sport} onChange={(e) => setSport(e.target.value)}>
        <option value="">All sports</option>
        {sports.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button
        onClick={() => {
          setSport("");
          setDate("");
        }}
      >
        Clear
      </button>
    </div>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFiltered(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <h1 className="page-title">Sports Calendar</h1>
        {!loading && <Filters events={events} onFilter={setFiltered} />}
        {loading ? (
          <p className="loading">Loading events...</p>
        ) : filtered.length === 0 ? (
          <p className="loading">No events found.</p>
        ) : (
          <div className="events-grid">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
