# Listing Images Feature

## Overview

Added support for multiple images per listing with a beautiful carousel gallery.

## What Was Added

### 1. Database Schema
- **Table**: `listing_images`
- **Fields**: 
  - `id` (UUID)
  - `listing_id` (FK to listings)
  - `image_url` (TEXT)
  - `display_order` (INTEGER)
  - `created_at`, `updated_at`

### 2. API Updates
- **Listings API** now joins with `listing_images` table
- Images are automatically sorted by `display_order`
- All queries (getListings, getListingById, search, filter) include images

### 3. Components
- **ImageGallery Component**: Swipeable carousel with:
  - Smooth horizontal scrolling
  - Pagination dots
  - Image counter (e.g., "2 / 5")
  - Fallback to placeholder if no images

- **ListingCard**: Uses first image from `images` array
- **ListingDetailScreen**: Full image gallery at the top

### 4. Library Used
**react-native-snap-carousel** - Popular, performant carousel library for React Native

## Setup Instructions

### 1. Create the Database Table

Run the SQL in [setup-listing-images.sql](setup-listing-images.sql) in your Supabase SQL Editor:

```sql
-- Creates the table
CREATE TABLE public.listing_images (...)

-- Sets up RLS policies
-- Inserts sample images for all listings
```

### 2. Test the Feature

After running the SQL:
1. Refresh your app
2. Open Home screen - cards now show real images
3. Tap a listing - see the image carousel
4. Swipe left/right to view all images
5. Notice the pagination dots and counter

## Image Gallery Features

### Visual Elements
- **Swipeable**: Swipe left/right to browse images
- **Pagination Dots**: Small dots at bottom showing current position
- **Image Counter**: "1 / 4" badge in top-right
- **Smooth Transitions**: Native performance with snap-to-item
- **Responsive**: Adapts to screen width

### User Experience
- First image (display_order = 1) is the primary/cover image
- Shows on listing cards
- Detail screen shows full gallery
- Graceful fallback to placeholder if no images

## Database Structure

```sql
listing_images
├── id (UUID)
├── listing_id (TEXT) → references listings(id)
├── image_url (TEXT)
├── display_order (INT) ← determines order in gallery
├── created_at
└── updated_at
```

## Adding Images to Your Listings

### Via SQL:
```sql
INSERT INTO public.listing_images (listing_id, image_url, display_order)
VALUES 
  ('your-listing-id', 'https://your-image-url.jpg', 1),
  ('your-listing-id', 'https://your-image-url-2.jpg', 2);
```

### Via Supabase Dashboard:
1. Go to Table Editor → listing_images
2. Click "Insert row"
3. Fill in:
   - listing_id: Your listing's ID
   - image_url: Full URL to image
   - display_order: Number (1 = first image)

## Image Sources

Current sample images use Unsplash URLs. For production:

### Options:
1. **Supabase Storage**: Upload to Supabase bucket, get URLs
2. **Cloudinary**: Image CDN with transformations
3. **AWS S3**: Own infrastructure
4. **Imgix**: Image optimization service

### Recommended: Supabase Storage

```typescript
// Upload image
const { data, error } = await supabase.storage
  .from('listing-images')
  .upload(`${listingId}/${filename}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('listing-images')
  .getPublicUrl(`${listingId}/${filename}`);

// Save to listing_images table
await supabase
  .from('listing_images')
  .insert({
    listing_id: listingId,
    image_url: publicUrl,
    display_order: 1
  });
```

## API Response Structure

```typescript
{
  id: "listing-1",
  title: "Bali Surf & Yoga Retreat",
  // ... other listing fields
  images: [
    {
      id: "img-1",
      listing_id: "listing-1",
      image_url: "https://...",
      display_order: 1,
      created_at: "2026-01-01..."
    },
    {
      id: "img-2",
      listing_id: "listing-1",
      image_url: "https://...",
      display_order: 2,
      created_at: "2026-01-01..."
    }
  ]
}
```

## Component Usage

### ImageGallery Component

```tsx
import ImageGallery from "../components/ImageGallery";

<ImageGallery images={listing.images || []} />
```

### In ListingCard
```tsx
// Automatically uses first image
const imageUrl = images && images.length > 0 
  ? images[0].image_url 
  : "fallback-url";
```

## Future Enhancements

- [ ] Fullscreen image viewer (pinch to zoom)
- [ ] Image loading states and placeholders
- [ ] Image caching for performance
- [ ] Video support
- [ ] 360° virtual tours
- [ ] Image upload UI for creators
- [ ] Image editing/cropping tools
- [ ] Automatic image optimization
- [ ] Lazy loading for better performance

## Troubleshooting

### Images not showing
1. Check if `listing_images` table exists
2. Verify RLS policies allow read access
3. Check image URLs are valid and accessible
4. Look for errors in console logs

### Carousel not working
1. Ensure `react-native-snap-carousel` is installed
2. Check TypeScript types are installed
3. Verify images array is not empty

### Images in wrong order
1. Check `display_order` values in database
2. Should be sequential: 1, 2, 3, 4...
3. Query sorts by display_order automatically

---

Built with ❤️ using react-native-snap-carousel
