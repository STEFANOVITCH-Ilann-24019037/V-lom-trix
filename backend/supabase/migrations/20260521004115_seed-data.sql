-- ============================================================
-- SEED — Données de test Vélométrix
-- Mot de passe de tous les comptes : password
-- ============================================================

-- ── Utilisateurs ────────────────────────────────────────────
insert into users (id, name, email, password, strava_connected, created_at, updated_at) values
  (1, 'Alice Martin',   'alice@test.com',   '$2y$12$.UpnUAc5BChd8oQmLeETx.Wzu2amdN.awLtyuX8XNHtnACnBhmBxK', false, now(), now()),
  (2, 'Bob Dupont',     'bob@test.com',     '$2y$12$.UpnUAc5BChd8oQmLeETx.Wzu2amdN.awLtyuX8XNHtnACnBhmBxK', false, now(), now()),
  (3, 'Charlie Vide',   'charlie@test.com', '$2y$12$.UpnUAc5BChd8oQmLeETx.Wzu2amdN.awLtyuX8XNHtnACnBhmBxK', false, now(), now());

select setval('users_id_seq', 3);

-- ── Vélos ────────────────────────────────────────────────────
insert into bikes (id, user_id, name, type, initial_km, current_km, created_at, updated_at) values
  (1, 1, 'Trek Émonda SL6',         'route',  0,   2800, now(), now()),
  (2, 1, 'Specialized Stumpjumper', 'vtt',    0,    300, now(), now()),
  (3, 2, 'Canyon Grail',            'gravel', 500, 2100, now(), now());

select setval('bikes_id_seq', 3);

-- ── Pièces ───────────────────────────────────────────────────
-- Trek Émonda (bike 1) — 2800 km → pièces très usées
insert into parts (bike_id, name, lifespan_km, last_changed_km, current_km, created_at, updated_at) values
  (1, 'Chaîne',                  3000, 0, 2800, now(), now()),
  (1, 'Cassette',                6000, 0, 2800, now(), now()),
  (1, 'Plaquettes frein avant',  2000, 0, 2800, now(), now()),
  (1, 'Plaquettes frein arrière',2000, 0, 2800, now(), now()),
  (1, 'Pneus',                   5000, 0, 2800, now(), now()),
-- Specialized Stumpjumper (bike 2) — 300 km → quasi neuf
  (2, 'Chaîne',                  3000, 0, 300, now(), now()),
  (2, 'Cassette',                6000, 0, 300, now(), now()),
  (2, 'Plaquettes frein avant',  2000, 0, 300, now(), now()),
  (2, 'Plaquettes frein arrière',2000, 0, 300, now(), now()),
  (2, 'Pneus',                   5000, 0, 300, now(), now()),
-- Canyon Grail (bike 3) — milieu de vie, plaquettes oranges
  (3, 'Chaîne',                  3000, 500, 2100, now(), now()),
  (3, 'Cassette',                6000, 500, 2100, now(), now()),
  (3, 'Plaquettes frein avant',  2000, 500, 2100, now(), now()),
  (3, 'Plaquettes frein arrière',2000, 500, 2100, now(), now()),
  (3, 'Pneus',                   5000, 500, 2100, now(), now());

select setval('parts_id_seq', 15);