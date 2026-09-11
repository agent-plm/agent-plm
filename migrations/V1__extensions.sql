-- Capability baseline. CREATE EXTENSION runs as the Postgres superuser in
-- infra/postgres/init; the application role must not require superuser.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    RAISE EXCEPTION 'Required extension "vector" is missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    RAISE EXCEPTION 'Required extension "pg_trgm" is missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    RAISE EXCEPTION 'Required extension "pgcrypto" is missing';
  END IF;
END $$;
