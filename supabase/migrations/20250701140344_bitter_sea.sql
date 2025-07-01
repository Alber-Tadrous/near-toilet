/*
  # Create function to get user statistics

  1. Function
    - `get_user_stats` - returns user activity statistics
    - Counts restrooms added, reviews written, helpful votes

  2. Parameters
    - `user_uuid` (uuid) - user's ID

  3. Returns
    - `restrooms_added` - number of restrooms user has added
    - `reviews_written` - number of reviews user has written
    - `helpful_votes` - placeholder for future helpful vote feature
*/

CREATE OR REPLACE FUNCTION get_user_stats(user_uuid uuid)
RETURNS TABLE (
  restrooms_added bigint,
  reviews_written bigint,
  helpful_votes bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    (SELECT COUNT(*) FROM restrooms WHERE created_by = user_uuid) as restrooms_added,
    (SELECT COUNT(*) FROM reviews WHERE user_id = user_uuid) as reviews_written,
    0::bigint as helpful_votes -- Placeholder for future feature
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_stats TO authenticated;