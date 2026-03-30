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

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <h1 className="page-title">Sports Calendar</h1>
        {loading ? (
          <p className="loading">Loading events...</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
