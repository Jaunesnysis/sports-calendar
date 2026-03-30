INSERT INTO sport (name) VALUES
  ('Football'),
  ('Ice Hockey'),
  ('Basketball');

INSERT INTO team (name, short_name) VALUES
  ('FC Salzburg', 'Salzburg'),
  ('SK Sturm Graz', 'Sturm'),
  ('EC KAC', 'KAC'),
  ('Vienna Capitals', 'Capitals');

INSERT INTO venue (name, city, address, capacity) VALUES
  ('Red Bull Arena', 'Salzburg', 'Friedensstraße 1, 5071 Wals', 30188),
  ('Merkur Eisstadion', 'Klagenfurt', 'Südring 29, 9020 Klagenfurt', 5000);

INSERT INTO event (event_datetime, status, _sport_id, _venue_id, _home_team_id, _away_team_id) VALUES
  ('2019-07-18 18:30:00', 'finished', 1, 1, 1, 2),
  ('2019-10-23 09:45:00', 'finished', 2, 2, 3, 4);