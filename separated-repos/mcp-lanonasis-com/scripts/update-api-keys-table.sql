-- Update api_keys table to add missing columns needed by the dashboard

-- Add service column if it doesn't exist
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS service TEXT DEFAULT 'all';

-- Add rate_limited column if it doesn't exist
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS rate_limited BOOLEAN DEFAULT true;

-- Add last_used column if it doesn't exist
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS last_used TIMESTAMP WITH TIME ZONE;

-- Update the check constraint for service values
ALTER TABLE api_keys ADD CONSTRAINT IF NOT EXISTS check_service 
CHECK (service IN ('all', 'payment', 'wallet', 'verification', 'utility', 'trade', 'bank', 'fraud'));

-- Create policy for authenticated users to insert their own API keys
CREATE POLICY IF NOT EXISTS "Users can create their own api_keys" ON api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own API keys
CREATE POLICY IF NOT EXISTS "Users can delete their own api_keys" ON api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- Create policy for authenticated users to update their own API keys
CREATE POLICY IF NOT EXISTS "Users can update their own api_keys" ON api_keys
  FOR UPDATE USING (auth.uid() = user_id);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_api_keys_updated_at BEFORE UPDATE
  ON api_keys FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();