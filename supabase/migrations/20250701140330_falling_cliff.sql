/*
  # Create reports table

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `restroom_id` (uuid) - references restrooms table
      - `user_id` (uuid) - references users table
      - `report_type` (enum) - inappropriate, incorrect_info, closed, other
      - `description` (text) - details about the report
      - `status` (enum) - pending, reviewed, resolved
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policy for authenticated users to create reports
    - Add policy for users to read their own reports
    - Restrict admin access for managing reports
*/

-- Create enums for report types and status
CREATE TYPE report_type AS ENUM ('inappropriate', 'incorrect_info', 'closed', 'other');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restroom_id uuid REFERENCES restrooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  description text NOT NULL,
  status report_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_restroom_id ON reports (restroom_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports (user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports (created_at DESC);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports"
  ON reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own reports
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);