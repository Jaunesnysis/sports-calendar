CREATE TABLE sport (
  id    SERIAL PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE team (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  short_name  VARCHAR(20)
);

CREATE TABLE venue (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  city      VARCHAR(100),
  address   VARCHAR(255),
  capacity  INTEGER
);

CREATE TABLE event (
  id              SERIAL PRIMARY KEY,
  event_datetime  TIMESTAMP NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  description     TEXT,
  _sport_id       INTEGER NOT NULL REFERENCES sport(id),
  _venue_id       INTEGER REFERENCES venue(id),
  _home_team_id   INTEGER NOT NULL REFERENCES team(id),
  _away_team_id   INTEGER NOT NULL REFERENCES team(id),

  CONSTRAINT chk_status CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  CONSTRAINT chk_different_teams CHECK (_home_team_id <> _away_team_id)
);