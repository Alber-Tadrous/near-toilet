/*
  # Create reviews table

  1. New Tables
    - `reviews`
      - `id` (uuid, primary key)
      - `restroom_id` (uuid) - references restrooms table
      - `user_id` (uuid) - references users table
      - `cleanliness_rating` (integer) - 1-5 rating
      - `operational_status` (enum) - working, broken, maintenance
      - `visit_date` (date) - when the user visited
      - `comments` (text, optional) - user comments
      - `photos` (text array) - URLs to uploaded photos
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reviews` table
    - Add policy for public read access to reviews
    - Add policy for authenticated users to create reviews
    - Add policy for users to update their own reviews
    - Add policy for users to delete their own reviews

  3. Constraints
    - Rating must be between 1 and 5
    - One review per user per restroom
*/

-- Create enum for operational status
CREATE TYPE operational_status AS ENUM ('working', 'broken', 'maintenance');

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restroom_id uuid REFERENCES restrooms(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  cleanliness_rating integer NOT NULL CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  operational_status operational_status NOT NULL,
  visit_date date NOT NULL,
  comments text,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  
  -- Ensure one review per user per restroom
  UNIQUE(restroom_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_restroom_id ON reviews (restroom_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read all reviews
CREATE POLICY "Public can read reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);