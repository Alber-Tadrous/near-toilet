# 🔌 API Documentation

This document describes the API endpoints and services used in the Restroom Finder app.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Restrooms](#restrooms)
- [Reviews](#reviews)
- [Reports](#reports)
- [Users](#users)
- [Database Functions](#database-functions)

## 🔐 Authentication

### Auth Service (`lib/auth.ts`)

#### `signUp(email, password, username)`
Creates a new user account.

**Parameters:**
- `email` (string) - User's email address
- `password` (string) - User's password (min 6 characters)
- `username` (string) - Display name

**Returns:** Promise<AuthResponse>

**Example:**
```typescript
await authService.signUp('user@example.com', 'password123', 'johndoe');
```

#### `signIn(email, password)`
Authenticates an existing user.

**Parameters:**
- `email` (string) - User's email address
- `password` (string) - User's password

**Returns:** Promise<AuthResponse>

#### `signOut()`
Signs out the current user.

**Returns:** Promise<void>

#### `getCurrentUser()`
Gets the current authenticated user's profile.

**Returns:** Promise<AuthUser | null>

## 🚻 Restrooms

### Restroom Service (`lib/restrooms.ts`)

#### `getNearbyRestrooms(latitude, longitude, radius?)`
Finds restrooms within a specified radius.

**Parameters:**
- `latitude` (number) - User's latitude
- `longitude` (number) - User's longitude
- `radius` (number, optional) - Search radius in meters (default: 5000)

**Returns:** Promise<Restroom[]>

**Example:**
```typescript
const restrooms = await restroomService.getNearbyRestrooms(37.7749, -122.4194, 2000);
```

#### `getRestroom(id)`
Gets detailed information about a specific restroom.

**Parameters:**
- `id` (string) - Restroom UUID

**Returns:** Promise<Restroom & { reviews: Review[] }>

#### `createRestroom(restroom)`
Adds a new restroom to the database.

**Parameters:**
- `restroom` (RestroomInsert) - Restroom data

**Required Fields:**
- `name` - Restroom name
- `address` - Street address
- `latitude` - GPS latitude
- `longitude` - GPS longitude
- `created_by` - User ID

**Optional Fields:**
- `description` - Additional details
- `accessibility_features` - Array of accessibility options
- `operating_hours` - Hours of operation
- `access_requirements` - Purchase required, etc.

**Returns:** Promise<Restroom>

#### `updateRestroom(id, updates)`
Updates an existing restroom.

**Parameters:**
- `id` (string) - Restroom UUID
- `updates` (Partial<RestroomInsert>) - Fields to update

**Returns:** Promise<Restroom>

## ⭐ Reviews

#### `createReview(review)`
Adds a review for a restroom.

**Parameters:**
- `review` (ReviewInsert) - Review data

**Required Fields:**
- `restroom_id` - Restroom UUID
- `user_id` - User UUID
- `cleanliness_rating` - Rating 1-5
- `operational_status` - 'working' | 'broken' | 'maintenance'
- `visit_date` - Date of visit

**Optional Fields:**
- `comments` - User comments
- `photos` - Array of photo URLs

**Returns:** Promise<Review>

#### `getReviews(restroomId)`
Gets all reviews for a restroom.

**Parameters:**
- `restroomId` (string) - Restroom UUID

**Returns:** Promise<Review[]>

## 🚨 Reports

#### `reportRestroom(restroomId, userId, reportType, description)`
Reports an issue with a restroom.

**Parameters:**
- `restroomId` (string) - Restroom UUID
- `userId` (string) - Reporter's user ID
- `reportType` (string) - 'inappropriate' | 'incorrect_info' | 'closed' | 'other'
- `description` (string) - Report details

**Returns:** Promise<Report>

## 👤 Users

User data is managed through Supabase Auth and the users table.

### User Profile Structure
```typescript
interface AuthUser {
  id: string;
  email: string;
  username?: string;
}
```

## 🗄️ Database Functions

### `get_nearby_restrooms(lat, lng, radius_meters?)`
PostgreSQL function for efficient location-based queries.

**Parameters:**
- `lat` (double precision) - Latitude
- `lng` (double precision) - Longitude
- `radius_meters` (integer, default 5000) - Search radius

**Returns:** Table with restroom data + distance

### `get_user_stats(user_uuid)`
Gets user activity statistics.

**Parameters:**
- `user_uuid` (uuid) - User's ID

**Returns:**
```sql
TABLE (
  restrooms_added bigint,
  reviews_written bigint,
  helpful_votes bigint
)
```

## 🔒 Security & Permissions

### Row Level Security (RLS)

All tables use RLS policies to ensure data security:

#### Restrooms
- **Public read**: Active restrooms only
- **Authenticated create**: Users can add restrooms
- **Owner update**: Users can update their own restrooms

#### Reviews
- **Public read**: All reviews visible
- **Authenticated create**: Users can add reviews
- **Owner update/delete**: Users can modify their own reviews

#### Reports
- **Authenticated create**: Users can create reports
- **Owner read**: Users can view their own reports

#### Users
- **Owner read/update**: Users can access their own data
- **Public username read**: For review attribution

### API Rate Limiting

Supabase provides built-in rate limiting:
- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour

## 🌐 Error Handling

### Common Error Codes

#### Authentication Errors
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_NOT_FOUND` - Account doesn't exist
- `EMAIL_NOT_CONFIRMED` - Email verification required

#### Database Errors
- `PERMISSION_DENIED` - RLS policy violation
- `VALIDATION_ERROR` - Invalid data format
- `DUPLICATE_KEY` - Unique constraint violation

#### Location Errors
- `LOCATION_PERMISSION_DENIED` - GPS access denied
- `LOCATION_UNAVAILABLE` - GPS service unavailable

### Error Response Format
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}
```

## 📊 Data Types

### Restroom
```typescript
interface Restroom {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  name: string;
  description?: string;
  accessibility_features: string[];
  operating_hours?: string;
  access_requirements?: string;
  created_by: string;
  status: 'active' | 'inactive' | 'pending_review';
  created_at: string;
  updated_at: string;
}
```

### Review
```typescript
interface Review {
  id: string;
  restroom_id: string;
  user_id: string;
  cleanliness_rating: number; // 1-5
  operational_status: 'working' | 'broken' | 'maintenance';
  visit_date: string;
  comments?: string;
  photos: string[];
  created_at: string;
}
```

### Report
```typescript
interface Report {
  id: string;
  restroom_id: string;
  user_id: string;
  report_type: 'inappropriate' | 'incorrect_info' | 'closed' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}
```

## 🔄 Real-time Subscriptions

### Subscribe to Restroom Changes
```typescript
const subscription = supabase
  .channel('restrooms')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'restrooms' },
    (payload) => {
      console.log('Restroom updated:', payload);
    }
  )
  .subscribe();
```

### Subscribe to New Reviews
```typescript
const subscription = supabase
  .channel('reviews')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'reviews' },
    (payload) => {
      console.log('New review:', payload);
    }
  )
  .subscribe();
```

## 🚀 Performance Tips

### Efficient Queries
- Use `get_nearby_restrooms()` function for location queries
- Limit results with pagination
- Use select() to fetch only needed columns
- Cache frequently accessed data

### Batch Operations
```typescript
// Batch insert multiple restrooms
const { data, error } = await supabase
  .from('restrooms')
  .insert(restroomArray);
```

### Optimized Filters
```typescript
// Efficient filtering
const { data } = await supabase
  .from('restrooms')
  .select('*')
  .eq('status', 'active')
  .contains('accessibility_features', ['Wheelchair Accessible'])
  .limit(20);
```

---

For more information, see the [Supabase Documentation](https://supabase.com/docs) and [React Native Documentation](https://reactnative.dev/docs/getting-started).