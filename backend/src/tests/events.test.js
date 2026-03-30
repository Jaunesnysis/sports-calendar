const request = require("supertest");
const express = require("express");
const cors = require("cors");
const eventRoutes = require("../routes/events");

// Set up a test version of the app
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);

describe("GET /api/events", () => {
  it("should return 200 and an array of events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return events with the correct fields", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).toBe(200);
    const event = res.body[0];
    expect(event).toHaveProperty("id");
    expect(event).toHaveProperty("sport");
    expect(event).toHaveProperty("home_team");
    expect(event).toHaveProperty("away_team");
    expect(event).toHaveProperty("event_datetime");
  });
});

describe("GET /api/events/:id", () => {
  it("should return a single event", async () => {
    const res = await request(app).get("/api/events/1");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
  });

  it("should return 404 for non-existent event", async () => {
    const res = await request(app).get("/api/events/999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error", "Event not found");
  });

  it("should return 400 for invalid id", async () => {
    const res = await request(app).get("/api/events/abc");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid event id");
  });
});

describe("POST /api/events", () => {
  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/api/events").send({
      event_datetime: "2026-05-01 18:00:00",
    });
    expect(res.status).toBe(400);
  });

  it("should return 400 when home and away teams are the same", async () => {
    const res = await request(app).post("/api/events").send({
      event_datetime: "2026-05-01 18:00:00",
      _sport_id: 1,
      _home_team_id: 1,
      _away_team_id: 1,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Home and away teams must be different",
    );
  });

  it("should create a new event and return 201", async () => {
    const res = await request(app).post("/api/events").send({
      event_datetime: "2026-06-01 18:00:00",
      _sport_id: 1,
      _home_team_id: 1,
      _away_team_id: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});

afterAll(async () => {
  const pool = require("../db/pool");
  await pool.end();
});
