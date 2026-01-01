export interface IncludedItem {
  id: string;
  title: string;
  description: string;
}

export interface ItineraryItem {
  id: string;
  day: number;
  title: string;
  description: string;
}

export interface ListingFormData {
  // Step 1: Basic Info
  title: string;
  destination: string;
  short_description: string;
  description: string;
  tags: string[];

  // Step 2: Dates & Pricing
  start_date: Date | null;
  end_date: Date | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;

  // Step 3: Group Details
  max_group_size: number;
  available_spots: number;
  age_range_min: number;
  age_range_max: number;
  difficulty: "easy" | "moderate" | "challenging";

  // Step 4: What's Included
  included_items: IncludedItem[];
  not_included_items: IncludedItem[];
  cancellation_policy: string;

  // Step 5: Itinerary
  itinerary: ItineraryItem[];

  // Step 6: Photos
  photos: { url: string; storage_path: string }[];
}

export type DifficultyLevel = "easy" | "moderate" | "challenging";

export interface CreateListingPayload {
  title: string;
  destination: string;
  short_description: string | null;
  description: string | null;
  tags: string[] | null;
  start_date: string | null;
  end_date: string | null;
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
  status: "draft" | "published";
}
