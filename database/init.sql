CREATE DATABASE host;

\c host;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  pk_hash VARCHAR(30),
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  email VARCHAR(30),
  role VARCHAR(20),
  stx_address VARCHAR(30)
);

CREATE TABLE agents (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  role VARCHAR(20),
  stx_address VARCHAR(30)
);

CREATE TABLE covers (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  premium_daily REAL,
  premium_weekly REAL,
  premium_monthly REAL,
  premium_quarterly REAL,
  premium_yearly REAL,
  rating REAL,
  capacity INT,
  cover_type TEXT check (cover_type in ('smart_contract', 'de-peg')),
  stx_address VARCHAR(30)
);

CREATE TABLE created_covers (
  ID SERIAL PRIMARY KEY,
  cover_id INT,
  CONSTRAINT fk_cover FOREIGN KEY(cover_id) REFERENCES covers(id)
);

CREATE TABLE claims (
  ID SERIAL PRIMARY KEY,
  created_cover_id INT,
  CONSTRAINT fk_created_cover FOREIGN KEY(created_cover_id) REFERENCES created_covers(id)
);

CREATE TABLE votes (
  ID SERIAL PRIMARY KEY,
  claim_id INT,
  CONSTRAINT fk_claim FOREIGN KEY(claim_id) REFERENCES claims(id)
);

CREATE TABLE prompts (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  prompt VARCHAR(150),
  response_type TEXT check (response_type in ('rating', 'description'))
);

INSERT INTO
  covers (name, cover_type)
VALUES
  ('Uniswap V2', 'smart_contract'),
  ('1inch', 'smart_contract'),
  ('Yearn Finance', 'smart_contract'),
  ('Aave v2', 'smart_contract'),
  ('USDA - Arkadiko', 'de-peg'),
  ('UWU - UWU Protocol', 'de-peg'),
  ('DoC - Dollar on Chain', 'de-peg'),
  ('USDC', 'de-peg'),
  ('USDT - Tether USDt', 'de-peg');