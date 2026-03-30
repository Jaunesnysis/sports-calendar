const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// Reusable query to avoid repetition between GET all and GET one
const EVENT_QUERY = `
  SELECT
    e.id,
    e.event_datetime,
    e.status,
    e.description,
    s.name AS sport,
    v.name AS venue,
    v.city AS venue_city,
    ht.name AS home_team,
    ht.short_name AS home_team_short,
    at.name AS away_team,
    at.short_name AS away_team_short
  FROM event e
  JOIN sport s ON e._sport_id = s.id
  LEFT JOIN venue v ON e._venue_id = v.id
  JOIN team ht ON e._home_team_id = ht.id
  JOIN team at ON e._away_team_id = at.id
`;

// GET all events, ordered by date
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      EVENT_QUERY + "ORDER BY e.event_datetime ASC",
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET single event by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Reject non-numeric ids before hitting the database
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const result = await pool.query(EVENT_QUERY + "WHERE e.id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST new event
router.post("/", async (req, res) => {
  try {
    const {
      event_datetime,
      status,
      description,
      _sport_id,
      _venue_id,
      _home_team_id,
      _away_team_id,
    } = req.body;

    // Check all required fields are present
    if (!event_datetime || !_sport_id || !_home_team_id || !_away_team_id) {
      return res.status(400).json({
        error:
          "event_datetime, _sport_id, _home_team_id and _away_team_id are required",
      });
    }

    // A team can't play against itself
    if (_home_team_id === _away_team_id) {
      return res
        .status(400)
        .json({ error: "Home and away teams must be different" });
    }

    const result = await pool.query(
      `
      INSERT INTO event (event_datetime, status, description, _sport_id, _venue_id, _home_team_id, _away_team_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        event_datetime,
        status || "scheduled",
        description,
        _sport_id,
        _venue_id || null, // venue is optional
        _home_team_id,
        _away_team_id,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
