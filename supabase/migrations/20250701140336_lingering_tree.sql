/*
  # Create function to get nearby restrooms

  1. Function
    - `get_nearby_restrooms` - returns restrooms within specified radius
    - Uses Haversine formula for distance calculation
    - Filters by active status
    - Orders by distance

  2. Parameters
    - `lat` (double precision) - user's latitude
    - `lng` (double precision) - user's longitude
    - `radius_meters` (integer) - search radius in meters (default 5000)

  3. Returns
    - All restroom data plus calculated distance
    - Only active restrooms
    - Ordered by distance (closest first)
*/

CREATE OR REPLACE FUNCTION get_nearby_restrooms(
  lat double precision,
  lng double precision,
  radius_meters integer DEFAULT 5000
)
RETURNS TABLE (
  id uuid,
  latitude double precision,
  longitude double precision,
  address text,
  name text,
  description text,
  accessibility_features text[],
  operating_hours text,
  access_requirements text,
  created_by uuid,
  status restroom_status,
  created_at timestamptz,
  updated_at timestamptz,
  distance_meters double precision
) 
LANGUAGE sql
STABLE
AS $$
  SELECT 
    r.id,
    r.latitude,
    r.longitude,
    r.address,
    r.name,
    r.description,
    r.accessibility_features,
    r.operating_hours,
    r.access_requirements,
    r.created_by,
    r.status,
    r.created_at,
    r.updated_at,
    (
      6371000 * acos(
        cos(radians(lat)) * 
        cos(radians(r.latitude)) * 
        cos(radians(r.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(r.latitude))
      )
    ) AS distance_meters
  FROM restrooms r
  WHERE r.status = 'active'
    AND (
      6371000 * acos(
        cos(radians(lat)) * 
        cos(radians(r.latitude)) * 
        cos(radians(r.longitude) - radians(lng)) + 
        sin(radians(lat)) * 
        sin(radians(r.latitude))
      )
    ) <= radius_meters
  ORDER BY distance_meters ASC;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_nearby_restrooms TO authenticated;
GRANT EXECUTE ON FUNCTION get_nearby_restrooms TO anon;