# Database Schema Mapping

## Form Data → Database Mapping

This document shows exactly how the form data maps to your Supabase `listings` table.

## Complete Field Mapping

| Form Field | Step | Type | Database Column | Transform | Notes |
|------------|------|------|-----------------|-----------|-------|
| `title` | 1 | string | `title` | Direct | Required, non-empty |
| `destination` | 1 | string | `destination` | Direct | Required, non-empty |
| `short_description` | 1 | string | `short_description` | Direct or null | Max 150 chars |
| `description` | 1 | string | `description` | Direct or null | Full description |
| `tags` | 1 | string[] | `tags` | Array or null | PostgreSQL text[] |
| `start_date` | 2 | Date | `start_date` | toISOString() | timestamp without time zone |
| `end_date` | 2 | Date | `end_date` | toISOString() | timestamp without time zone |
| `price_min` | 2 | number | `price_min` | Direct | integer, required |
| `price_max` | 2 | number | `price_max` | Direct or null | integer, optional |
| `currency` | 2 | string | `currency` | Direct | Default: 'USD' |
| `max_group_size` | 3 | number | `max_group_size` | Direct | integer, default: 12 |
| `available_spots` | 3 | number | `available_spots` | Direct | integer, default: 10 |
| `age_range_min` | 3 | number | `age_range_min` | Direct | integer, default: 18 |
| `age_range_max` | 3 | number | `age_range_max` | Direct | integer, default: 65 |
| `difficulty` | 3 | string | `difficulty` | Direct | 'easy' \| 'moderate' \| 'challenging' |
| `included_items` | 4 | array | `included_items` | JSON array | jsonb in database |
| `not_included_items` | 4 | array | `not_included_items` | JSON array | jsonb in database |
| `cancellation_policy` | 4 | string | `cancellation_policy` | Direct or null | text |
| `itinerary` | 5 | array | `itinerary` | JSON array | jsonb in database |
| `photos` | 6 | string[] | - | Upload to storage | Separate listing_images table |
| - | - | - | `id` | Auto-generated | UUID via crypto.randomUUID() |
| - | - | - | `creator_id` | From user.id | Foreign key to users table |
| - | - | - | `status` | 'draft' or 'published' | Set based on action |
| - | - | - | `instant_bookable` | null | Not in form, defaults false |
| - | - | - | `rating` | null | Not in form, defaults 0 |
| - | - | - | `review_count` | null | Not in form, defaults 0 |
| - | - | - | `created_at` | Auto | Database default: now() |
| - | - | - | `updated_at` | Auto | Database default: now() |

## Detailed Type Mappings

### Step 1: Basic Info

```typescript
// Form Types
interface BasicInfo {
  title: string;                    // Required
  destination: string;              // Required
  short_description: string;        // Required, max 150
  description: string;              // Required
  tags: string[];                   // Optional array
}

// Database Schema
{
  title: text NOT NULL,
  destination: text NOT NULL,
  short_description: text NULL,
  description: text NULL,
  tags: text[] NULL,
}

// Payload Transform
{
  title: formData.title,                                    // Direct
  destination: formData.destination,                        // Direct
  short_description: formData.short_description || null,   // Empty string → null
  description: formData.description || null,               // Empty string → null
  tags: formData.tags.length > 0 ? formData.tags : null,  // Empty array → null
}
```

### Step 2: Dates & Pricing

```typescript
// Form Types
interface DatesPricing {
  start_date: Date | null;
  end_date: Date | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;                 // Default: 'USD'
}

// Database Schema
{
  start_date: timestamp without time zone NULL,
  end_date: timestamp without time zone NULL,
  price_min: integer NULL,
  price_max: integer NULL,
  currency: text NULL DEFAULT 'USD',
}

// Payload Transform
{
  start_date: formData.start_date ? formData.start_date.toISOString() : null,
  end_date: formData.end_date ? formData.end_date.toISOString() : null,
  price_min: formData.price_min,                          // Direct
  price_max: formData.price_max,                          // Direct or null
  currency: formData.currency,                            // Direct
}
```

### Step 3: Group Details

```typescript
// Form Types
interface GroupDetails {
  max_group_size: number;           // Default: 12
  available_spots: number;          // Default: 10
  age_range_min: number;            // Default: 18
  age_range_max: number;            // Default: 65
  difficulty: 'easy' | 'moderate' | 'challenging';
}

// Database Schema
{
  max_group_size: integer NULL DEFAULT 12,
  available_spots: integer NULL DEFAULT 10,
  age_range_min: integer NULL DEFAULT 18,
  age_range_max: integer NULL DEFAULT 65,
  difficulty: text NULL DEFAULT 'moderate',
}

// Payload Transform
{
  max_group_size: formData.max_group_size,                // Direct
  available_spots: formData.available_spots,              // Direct
  age_range_min: formData.age_range_min,                  // Direct
  age_range_max: formData.age_range_max,                  // Direct
  difficulty: formData.difficulty,                        // Direct
}
```

### Step 4: What's Included

```typescript
// Form Types
interface IncludedItem {
  id: string;                       // Client-side only
  title: string;
  description: string;
}

interface WhatsIncluded {
  included_items: IncludedItem[];
  not_included_items: IncludedItem[];
  cancellation_policy: string;
}

// Database Schema
{
  included_items: jsonb NULL DEFAULT '[]',
  not_included_items: jsonb NULL DEFAULT '[]',
  cancellation_policy: text NULL,
}

// Payload Transform
{
  included_items: formData.included_items,                // Direct array
  not_included_items: formData.not_included_items,        // Direct array
  cancellation_policy: formData.cancellation_policy || null,
}

// Stored in DB as:
[
  { "id": "123", "title": "All meals", "description": "Breakfast, lunch, dinner" },
  { "id": "124", "title": "Accommodation", "description": "5-star hotels" }
]
```

### Step 5: Itinerary

```typescript
// Form Types
interface ItineraryItem {
  id: string;                       // Client-side only
  day: number;
  title: string;
  description: string;
}

interface Itinerary {
  itinerary: ItineraryItem[];
}

// Database Schema
{
  itinerary: jsonb NULL DEFAULT '[]',
}

// Payload Transform
{
  itinerary: formData.itinerary,                          // Direct array
}

// Stored in DB as:
[
  { "id": "123", "day": 1, "title": "Arrival", "description": "Meet at airport..." },
  { "id": "124", "day": 2, "title": "Safari", "description": "Early morning game drive..." }
]
```

### Step 6: Photos

```typescript
// Form Types
interface Photos {
  photos: string[];                 // URIs or storage paths
}

// Database Schema
// Separate table: listing_images
{
  id: text NOT NULL,
  listing_id: text NOT NULL,
  url: text NOT NULL,
  storage_path: text NOT NULL,
  caption: text NULL,
  display_order: integer NULL,
  created_at: timestamp,
  updated_at: timestamp,
}

// Upload Process (TODO)
for (let i = 0; i < formData.photos.length; i++) {
  await uploadListingImage(listingId, formData.photos[i], i);
}

// Each photo becomes a row:
{
  id: crypto.randomUUID(),
  listing_id: listingId,
  url: 'https://storage.supabase.co/...',
  storage_path: 'listings/123/photo-1.jpg',
  display_order: i,
  // caption and timestamps handled by DB
}
```

## Complete CreateListingPayload

```typescript
// TypeScript Interface
export interface CreateListingPayload {
  title: string;
  destination: string;
  short_description: string | null;
  description: string | null;
  tags: string[] | null;
  start_date: string | null;          // ISO string
  end_date: string | null;            // ISO string
  price_min: number | null;
  price_max: number | null;
  currency: string;
  max_group_size: number;
  available_spots: number;
  age_range_min: number;
  age_range_max: number;
  difficulty: string;
  included_items: any[];
  not_included_items: any[];
  cancellation_policy: string | null;
  itinerary: any[];
  status: 'draft' | 'published';
}
```

## Example Payload

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "creator_id": "user-123",
  "title": "Amazing Safari Adventure in Kenya",
  "destination": "Masai Mara, Kenya",
  "short_description": "Experience the wildlife of Africa on this incredible 7-day safari adventure through Kenya's most famous national park.",
  "description": "Join us for an unforgettable journey through the Masai Mara...",
  "tags": ["Safari", "Wildlife", "Adventure", "Photography"],
  "start_date": "2026-06-15T00:00:00.000Z",
  "end_date": "2026-06-22T00:00:00.000Z",
  "price_min": 2500,
  "price_max": 3500,
  "currency": "USD",
  "max_group_size": 12,
  "available_spots": 8,
  "age_range_min": 18,
  "age_range_max": 65,
  "difficulty": "moderate",
  "included_items": [
    {
      "id": "item-1",
      "title": "All meals included",
      "description": "Breakfast, lunch, and dinner provided daily"
    },
    {
      "id": "item-2",
      "title": "Accommodation",
      "description": "Luxury tented camps and lodges"
    },
    {
      "id": "item-3",
      "title": "Park fees",
      "description": "All national park entrance fees"
    }
  ],
  "not_included_items": [
    {
      "id": "item-4",
      "title": "International flights",
      "description": "Flights to and from Nairobi"
    },
    {
      "id": "item-5",
      "title": "Travel insurance",
      "description": "Personal travel and medical insurance"
    }
  ],
  "cancellation_policy": "Full refund if cancelled 30+ days before departure. 50% refund 15-29 days before. No refund within 14 days.",
  "itinerary": [
    {
      "id": "day-1",
      "day": 1,
      "title": "Arrival in Nairobi",
      "description": "Meet at airport, transfer to hotel, welcome dinner"
    },
    {
      "id": "day-2",
      "day": 2,
      "title": "Drive to Masai Mara",
      "description": "Morning departure, afternoon game drive"
    }
  ],
  "status": "published",
  "instant_bookable": false,
  "rating": 0,
  "review_count": 0,
  "created_at": "2026-01-01T10:30:00.000Z",
  "updated_at": "2026-01-01T10:30:00.000Z"
}
```

## Database Constraints & Defaults

### Constraints
- `id`: Primary key (text)
- `creator_id`: Foreign key → users(id) ON DELETE CASCADE
- `title`: NOT NULL
- `destination`: NOT NULL

### Defaults
```sql
instant_bookable: false
status: 'draft'
currency: 'USD'
max_group_size: 12
available_spots: 10
age_range_min: 18
age_range_max: 65
difficulty: 'moderate'
rating: 0
review_count: 0
included_items: '[]'::jsonb
not_included_items: '[]'::jsonb
itinerary: '[]'::jsonb
created_at: now()
updated_at: now()
```

## Null Handling Strategy

### Always Required (NOT NULL in form)
- title
- destination
- short_description (in form, but can be null in DB)
- description (in form, but can be null in DB)
- start_date (in form validation)
- end_date (in form validation)
- price_min (in form validation)
- currency
- max_group_size
- available_spots
- age_range_min
- age_range_max
- difficulty

### Optional (can be null)
- short_description (DB accepts null)
- description (DB accepts null)
- tags
- start_date (DB accepts null)
- end_date (DB accepts null)
- price_min (DB accepts null)
- price_max
- cancellation_policy
- All JSONB arrays default to `[]`

### Never Set by Form
- id (auto-generated)
- creator_id (from auth)
- instant_bookable (DB default)
- rating (DB default)
- review_count (DB default)
- created_at (DB default)
- updated_at (DB default)

## API Call Example

```typescript
import { createListing } from './src/Add/api/listingsApi';
import { useAuthStore } from './src/Auth/hooks/useAuthStore';

const { user } = useAuthStore();

// Prepare payload
const payload: CreateListingPayload = {
  title: formData.title,
  destination: formData.destination,
  short_description: formData.short_description || null,
  description: formData.description || null,
  tags: formData.tags.length > 0 ? formData.tags : null,
  start_date: formData.start_date ? formData.start_date.toISOString() : null,
  end_date: formData.end_date ? formData.end_date.toISOString() : null,
  price_min: formData.price_min,
  price_max: formData.price_max,
  currency: formData.currency,
  max_group_size: formData.max_group_size,
  available_spots: formData.available_spots,
  age_range_min: formData.age_range_min,
  age_range_max: formData.age_range_max,
  difficulty: formData.difficulty,
  included_items: formData.included_items,
  not_included_items: formData.not_included_items,
  cancellation_policy: formData.cancellation_policy || null,
  itinerary: formData.itinerary,
  status: 'published', // or 'draft'
};

// Create listing
try {
  await createListing(payload, user.id);
  console.log('Listing created successfully!');
} catch (error) {
  console.error('Failed to create listing:', error);
}
```

## Summary

✅ **All database fields are accounted for**
✅ **Type transformations are clear**
✅ **Null handling is explicit**
✅ **Defaults match database schema**
✅ **JSONB arrays properly formatted**
✅ **Timestamps properly converted**
✅ **Foreign keys properly set**

The form data maps cleanly to your database schema with proper type conversions and null handling.
