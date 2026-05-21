-- Vélométrix — schéma complet

create table if not exists users (
  id bigserial primary key,
  name varchar(255) not null,
  email varchar(255) not null unique,
  email_verified_at timestamp,
  password varchar(255) not null,
  strava_connected boolean not null default false,
  remember_token varchar(100),
  created_at timestamp,
  updated_at timestamp
);

create table if not exists strava_tokens (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp not null,
  created_at timestamp,
  updated_at timestamp
);

create table if not exists bikes (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  name varchar(255) not null,
  type varchar(10) not null check (type in ('route','vtt','ville','gravel')),
  initial_km integer not null default 0,
  current_km integer not null default 0,
  created_at timestamp,
  updated_at timestamp
);

create table if not exists parts (
  id bigserial primary key,
  bike_id bigint not null references bikes(id) on delete cascade,
  name varchar(255) not null,
  lifespan_km integer not null,
  last_changed_km integer not null default 0,
  current_km integer not null default 0,
  created_at timestamp,
  updated_at timestamp
);

create table if not exists part_health_histories (
  id bigserial primary key,
  part_id bigint not null references parts(id) on delete cascade,
  km_recorded integer not null,
  wear_percentage integer not null,
  recorded_at timestamp not null,
  created_at timestamp,
  updated_at timestamp
);

create table if not exists mobile_devices (
  id bigserial primary key,
  user_id bigint not null references users(id) on delete cascade,
  device_token varchar(255) not null,
  platform varchar(10) not null check (platform in ('ios','android')),
  created_at timestamp,
  updated_at timestamp
);

create table if not exists personal_access_tokens (
  id bigserial primary key,
  tokenable_type varchar(255) not null,
  tokenable_id bigint not null,
  name varchar(255) not null,
  token varchar(64) not null unique,
  abilities text,
  last_used_at timestamp,
  expires_at timestamp,
  created_at timestamp,
  updated_at timestamp
);

create index if not exists idx_personal_access_tokens_tokenable on personal_access_tokens(tokenable_type, tokenable_id);
create index if not exists idx_strava_tokens_user_id on strava_tokens(user_id);
create index if not exists idx_bikes_user_id on bikes(user_id);
create index if not exists idx_parts_bike_id on parts(bike_id);
create index if not exists idx_part_health_histories_part_id on part_health_histories(part_id);
create index if not exists idx_mobile_devices_user_id on mobile_devices(user_id);
