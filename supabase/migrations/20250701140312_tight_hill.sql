/*
  # Create restrooms table

  1. New Tables
    - `restrooms`
      - `id` (uuid, primary key)
      - `latitude` (double precision) - GPS latitude
      - `longitude` (double precision) - GPS longitude
      - `address` (text) - street address
      - `name` (text) - restroom/location name
      - `description` (text, optional) - additional details
      - `accessibility_features` (text array) - accessibility options
      - `operating_hours` (text, optional) - hours of operation
      - `access_requirements` (text, optional) - purchase required, key needed, etc.
      - `created_by` (uuid) - user who added the restroom
      - `status` (enum) - active, inactive, pending_review
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `restrooms` table
    - Add policy for public read access to active restrooms
    - Add policy for authenticated users to create restrooms
    - Add policy for users to update their own restrooms
    - Add policy for users to read their own pending restrooms

  3. Indexes
    - Spatial index for location-based queries
    - Index on status for filtering
    - Index on created_by for user queries
*/

-- Create enum for restroom status
CREATE TYPE restroom_status AS ENUM ('active', 'inactive', 'pending_review');

CREATE TABLE IF NOT EXISTS restrooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  address text NOT NULL,
  name text NOT NULL,
  description text,
  accessibility_features text[] DEFAULT '{}',
  operating_hours text,
  access_requirements text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  status restroom_status DEFAULT 'pending_review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_restrooms_location ON restrooms USING btree (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_restrooms_status ON restrooms (status);
CREATE INDEX IF NOT EXISTS idx_restrooms_created_by ON restrooms (created_by);

-- Enable RLS
ALTER TABLE restrooms ENABLE ROW LEVEL SECURITY;

-- Public can read active restrooms
CREATE POLICY "Public can read active restrooms"
  ON restrooms
  FOR SELECT
  TO public
  USING (status = 'active');

-- Authenticated users can create restrooms
CREATE POLICY "Authenticated users can create restrooms"
  ON restrooms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Users can read their own restrooms (including pending)
CREATE POLICY "Users can read own restrooms"
  ON restrooms
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

-- Users can update their own restrooms
CREATE POLICY "Users can update own restrooms"
  ON restrooms
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restrooms_updated_at
  BEFORE UPDATE ON restrooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();