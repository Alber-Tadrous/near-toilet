/*
  # Seed sample data for development

  1. Sample Data
    - Sample restrooms in San Francisco area
    - Various accessibility features and statuses
    - Realistic addresses and descriptions

  Note: This is for development/demo purposes only
*/

-- Insert sample restrooms (only if no restrooms exist)
INSERT INTO restrooms (
  latitude,
  longitude,
  address,
  name,
  description,
  accessibility_features,
  operating_hours,
  access_requirements,
  status
) 
SELECT * FROM (VALUES
  (37.7749, -122.4194, '1 Market St, San Francisco, CA 94105', 'Ferry Building Marketplace', 'Clean public restrooms in the historic Ferry Building', ARRAY['Wheelchair Accessible', 'Baby Changing Station'], '6:00 AM - 8:00 PM', NULL, 'active'),
  (37.7849, -122.4094, '2 Union Square, San Francisco, CA 94108', 'Union Square Public Restroom', 'Public restrooms near Union Square shopping area', ARRAY['Wheelchair Accessible'], '24 hours', NULL, 'active'),
  (37.7849, -122.4194, '3 Pier 39, San Francisco, CA 94133', 'Pier 39 Restrooms', 'Tourist area restrooms with bay views', ARRAY['Wheelchair Accessible', 'Baby Changing Station', 'Wide Doorway'], '9:00 AM - 9:00 PM', NULL, 'active'),
  (37.7649, -122.4094, '4 Mission St, San Francisco, CA 94103', 'Mission District Coffee Shop', 'Restrooms available for customers', ARRAY['Grab Bars'], '7:00 AM - 7:00 PM', 'Purchase required', 'active'),
  (37.7949, -122.4294, '5 Lombard St, San Francisco, CA 94133', 'Lombard Street Viewpoint', 'Public restrooms near the famous crooked street', ARRAY['Wheelchair Accessible'], '8:00 AM - 6:00 PM', NULL, 'active'),
  (37.7549, -122.4394, '6 Golden Gate Park, San Francisco, CA 94117', 'Golden Gate Park Restroom', 'Park restrooms near the main entrance', ARRAY['Wheelchair Accessible', 'Baby Changing Station', 'Wide Doorway'], '6:00 AM - 8:00 PM', NULL, 'active')
) AS sample_data(latitude, longitude, address, name, description, accessibility_features, operating_hours, access_requirements, status)
WHERE NOT EXISTS (SELECT 1 FROM restrooms LIMIT 1);