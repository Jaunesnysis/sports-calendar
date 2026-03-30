import { useEffect, useState } from "react";

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sports Calendar</h1>
      {events.map((event) => (
        <div key={event.id}>
          <p>
            {event.home_team} vs {event.away_team}
          </p>
          <p>{event.sport}</p>
          <p>{event.event_datetime}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
