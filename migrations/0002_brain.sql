create table if not exists brain_attempts (
  id            text primary key,
  guest_id      text not null,
  mode          text not null,
  room_id       text,
  question_ids  text not null,
  option_key    text not null,
  started_at    bigint not null,
  finished_at   bigint,
  score         integer,
  payload       text
);
create index if not exists brain_attempts_guest_idx on brain_attempts (guest_id, started_at desc);

create table if not exists brain_daily (
  day         text not null,
  guest_id    text not null,
  nickname    text not null,
  score       integer not null,
  payload     text not null,
  created_at  timestamptz not null default now(),
  primary key (day, guest_id)
);
create index if not exists brain_daily_score_idx on brain_daily (day, score desc, created_at asc);

create table if not exists brain_rooms (
  id            text primary key,
  question_ids  text not null,
  option_key    text not null,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null
);

create table if not exists brain_room_players (
  room_id     text not null,
  guest_id    text not null,
  nickname    text not null,
  score       integer,
  correct     integer,
  done        boolean not null default false,
  answers     text,
  payload     text,
  joined_at   timestamptz not null default now(),
  primary key (room_id, guest_id)
);
create index if not exists brain_room_players_room_idx on brain_room_players (room_id, joined_at);
