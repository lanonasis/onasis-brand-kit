-- Create maple schema
CREATE SCHEMA IF NOT EXISTS maple;

-- Set proper search path
ALTER DATABASE postgres SET search_path TO maple, public;

-- Comment on schema for documentation
COMMENT ON SCHEMA maple IS 'Schema for Lan Onasis Maple site functionality';

-- Enable Row Level Security on all future tables by default
ALTER DEFAULT PRIVILEGES IN SCHEMA maple GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA maple GRANT SELECT ON TABLES TO anon;

-- Always enable RLS
ALTER DEFAULT PRIVILEGES IN SCHEMA maple ALTER TABLES ENABLE ROW LEVEL SECURITY;
