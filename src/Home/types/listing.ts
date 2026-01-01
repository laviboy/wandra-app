export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  storage_path: string;
  caption: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface Listing {
  id: string;
  creator_id: string;
  creator_name?: string;
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
  images?: ListingImage[];
}

export interface ListingCardData {
  id: string;
  title: string;
  destination: string;
  short_description: string | null;
  tags: string[] | null;
  price_min: number | null;
  price_max: number | null;
  currency: string | null;
  start_date: string | null;
  available_spots: number | null;
  rating: number | null;
  review_count: number | null;
  difficulty: string | null;
}
