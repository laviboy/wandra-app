# Home Module - Listings Feature

This document describes the listings feature implementation in the Home module.

## Overview

The Home module displays travel/adventure listings from Supabase, allowing users to browse experiences and view detailed information. The implementation follows a professional UI/UX design pattern similar to popular travel booking platforms.

## Module Structure

```
src/Home/
├── api/
│   └── listingsApi.ts          # Supabase API calls for listings
├── components/
│   └── ListingCard.tsx         # Card component for displaying listing preview
├── hooks/
│   └── useListings.ts          # React Query hooks for data fetching
├── screens/
│   ├── HomeScreen.tsx          # Main screen showing list of listings
│   └── ListingDetailScreen.tsx # Detailed view of a single listing
└── types/
    └── listing.ts              # TypeScript types for listings
```

## Features

### HomeScreen
- **Listing Grid**: Displays all published listings in a scrollable list
- **Pull to Refresh**: Swipe down to refresh the listings
- **Loading States**: Shows loading spinner while fetching data
- **Empty State**: Friendly message when no listings are available
- **Error Handling**: Displays error message if data fetch fails
- **Navigation**: Tap any card to view full details

### ListingCard Component
The card displays key information to help users quickly evaluate an experience:

- **Hero Image**: Prominent image (currently using placeholder)
- **Urgency Badge**: "Only X spots left!" when availability is low (≤5 spots)
- **Category Tags**: First tag displayed as a badge
- **Difficulty Badge**: Shows experience difficulty level
- **Title**: Bold, attention-grabbing listing title
- **Location**: Destination with pin icon
- **Description**: Short teaser text
- **Rating**: Star rating with review count
- **Date**: Start date in friendly format
- **Price**: Displayed prominently with currency

### ListingDetailScreen
Comprehensive view of the listing with all details:

- **Hero Image**: Full-width header image
- **Header Section**: Title, location, tags, rating
- **Quick Info Cards**: Date, group size, difficulty at a glance
- **About Section**: Full description
- **Details Grid**: Available spots, age range, duration, booking type
- **What's Included**: Checklist of included items
- **Not Included**: Items not covered in price
- **Itinerary**: Day-by-day breakdown with numbered timeline
- **Cancellation Policy**: Terms and conditions
- **Bottom Booking Bar**: Fixed bar with price and "Book Now" button

## Database Schema

The listings table includes:

```typescript
interface Listing {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  destination: string;
  tags: string[] | null;
  price_min: number | null;
  price_max: number | null;
  currency: string | null;
  instant_bookable: boolean | null;
  status: string | null;
  start_date: string | null;
  end_date: string | null;
  max_group_size: number | null;
  available_spots: number | null;
  age_range_min: number | null;
  age_range_max: number | null;
  difficulty: string | null;
  rating: number | null;
  review_count: number | null;
  included_items: any[] | null;
  not_included_items: any[] | null;
  itinerary: any[] | null;
  cancellation_policy: string | null;
  created_at: string;
  updated_at: string;
}
```

## API Functions

### `listingsApi.getListings()`
Fetches all published listings, ordered by creation date (newest first).

### `listingsApi.getListingById(id)`
Retrieves a single listing by ID for the detail view.

### `listingsApi.searchListings(query)`
Searches listings by title or destination.

### `listingsApi.getListingsByTags(tags)`
Filters listings by specific tags.

## React Query Hooks

### `useListings()`
```typescript
const { data, isLoading, error, refetch, isRefetching } = useListings();
```
Fetches all listings with caching and automatic refetching.

### `useListing(id)`
```typescript
const { data, isLoading, error } = useListing(listingId);
```
Fetches a single listing by ID.

### `useSearchListings(query)`
```typescript
const { data, isLoading } = useSearchListings(searchTerm);
```
Searches listings (only enabled when query length > 0).

## Navigation

The Home module uses a stack navigator:

```typescript
type HomeStackParamList = {
  HomeMain: undefined;
  HomeDetail: { id: string };
};
```

Navigation example:
```typescript
// Navigate to detail screen
navigation.navigate('HomeDetail', { id: listing.id });
```

## Styling & Design

### Color Palette
- **Primary Text**: `#1F2937` (gray-900)
- **Secondary Text**: `#6B7280` (gray-500)
- **Accent**: `#4F46E5` (indigo-600)
- **Success**: `#10B981` (green-500)
- **Error**: `#EF4444` (red-500)
- **Urgent**: `#EF4444` (red-500)

### Typography
- **Page Title**: 32px, weight 800
- **Card Title**: 20px, weight 700
- **Detail Title**: 28px, weight 800
- **Section Title**: 20px, weight 700
- **Body Text**: 14-15px, weight 400-500
- **Price**: 20-24px, weight 800

### Spacing & Layout
- **Card Margin**: 16px horizontal, 8px vertical
- **Content Padding**: 16-20px
- **Border Radius**: 12-16px for cards
- **Shadow**: Subtle elevation for cards

## Setup & Installation

### 1. Database Setup

Run the SQL schema to create the listings table (already provided in your setup).

### 2. Seed Data

Use `sample-listings-data.sql` to populate test data:

```sql
-- 1. Get your user ID
SELECT id FROM auth.users LIMIT 1;

-- 2. Run the INSERT statements in sample-listings-data.sql
-- 3. Update the creator_id with your actual user ID
```

### 3. Images

Currently using placeholder images from Unsplash. To add real images:

1. Add an `images` array to the listings table
2. Store image URLs in Supabase Storage
3. Update `ListingCard.tsx` and `ListingDetailScreen.tsx` to use actual images

## Future Enhancements

- [ ] Add image gallery support
- [ ] Implement favorites/wishlist
- [ ] Add filtering by tags, price, date
- [ ] Add sorting options (price, rating, date)
- [ ] Implement search functionality
- [ ] Add "Book Now" functionality
- [ ] Add listing reviews and ratings display
- [ ] Implement infinite scroll/pagination
- [ ] Add share functionality
- [ ] Support for multiple images per listing
- [ ] Map view showing listing locations

## Testing

To test the implementation:

1. **Add test data**: Run the SQL seed data script
2. **Launch app**: Start Expo dev server
3. **View listings**: Open Home tab to see listing cards
4. **Test navigation**: Tap a card to view details
5. **Test refresh**: Pull down to refresh the list
6. **Test states**: 
   - Remove all listings to see empty state
   - Disconnect internet to see error state

## Troubleshooting

### Listings not showing
- Check Supabase connection in `utils/supabase.ts`
- Verify listings have `status = 'published'`
- Check console for API errors

### Images not loading
- Verify image URLs are valid
- Check network connectivity
- Update with actual image URLs (currently using placeholders)

### Navigation not working
- Ensure `HomeDetail` screen is registered in `BottomTabs.tsx`
- Check navigation types in `src/navigation/types.ts`

## Performance Considerations

- **React Query Caching**: Listings are cached to reduce API calls
- **Image Optimization**: Use appropriate image sizes and formats
- **List Optimization**: FlatList is used for efficient rendering
- **Lazy Loading**: Consider implementing pagination for large datasets

## Accessibility

- All interactive elements have appropriate touch targets (min 44x44px)
- Text has sufficient contrast ratios
- Consider adding screen reader labels
- Support for larger text sizes

---

Built with ❤️ using React Native, Expo, Supabase, and React Query
