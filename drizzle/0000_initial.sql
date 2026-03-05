CREATE TYPE run_status AS ENUM ('pending','completed','failed');

CREATE TABLE runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp NOT NULL DEFAULT now(),
  seed_keyword text NOT NULL,
  region text,
  audience text,
  settings jsonb NOT NULL,
  status run_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE niches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES runs(id),
  created_at timestamp NOT NULL DEFAULT now(),
  title text NOT NULL,
  audience text NOT NULL,
  problem text NOT NULL,
  context text NOT NULL,
  category text NOT NULL,
  tags jsonb NOT NULL,
  score_total integer NOT NULL,
  score_demand integer NOT NULL,
  score_buyer integer NOT NULL,
  score_competition integer NOT NULL,
  score_product_fit integer NOT NULL,
  reasons jsonb NOT NULL,
  keywords jsonb NOT NULL,
  trend_summary jsonb,
  assets jsonb,
  is_saved boolean NOT NULL DEFAULT false,
  is_generated_assets boolean NOT NULL DEFAULT false
);
