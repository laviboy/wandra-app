import { supabase } from "../../../utils/supabase";
import type { Listing } from "../types/listing";

export const listingsApi = {
  /**
   * Fetch all published listings with images
   */
  getListings: async (): Promise<Listing[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        images(id, listing_id, url, storage_path, caption, display_order, created_at, updated_at)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Sort images by display_order for each listing
    const listingsWithSortedImages = data?.map((listing) => ({
      ...listing,
      images:
        listing.images?.sort(
          (a: any, b: any) => a.display_order - b.display_order
        ) || [],
    }));

    return listingsWithSortedImages || [];
  },

  /**
   * Fetch a single listing by ID with images
   */
  getListingById: async (id: string): Promise<Listing | null> => {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        images(id, listing_id, url, storage_path, caption, display_order, created_at, updated_at)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Sort images by display_order
    if (data && data.images) {
      data.images = data.images.sort(
        (a: any, b: any) => a.display_order - b.display_order
      );
    }

    return data;
  },

  /**
   * Search listings by destination or tags
   */
  searchListings: async (query: string): Promise<Listing[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        images(id, listing_id, url, storage_path, caption, display_order, created_at, updated_at)
      `
      )
      .or(`title.ilike.%${query}%,destination.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Sort images by display_order for each listing
    const listingsWithSortedImages = data?.map((listing) => ({
      ...listing,
      images:
        listing.images?.sort(
          (a: any, b: any) => a.display_order - b.display_order
        ) || [],
    }));

    return listingsWithSortedImages || [];
  },

  /**
   * Filter listings by tags
   */
  getListingsByTags: async (tags: string[]): Promise<Listing[]> => {
    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        images(id, listing_id, url, storage_path, caption, display_order, created_at, updated_at)
      `
      )
      .contains("tags", tags)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Sort images by display_order for each listing
    const listingsWithSortedImages = data?.map((listing) => ({
      ...listing,
      images:
        listing.images?.sort(
          (a: any, b: any) => a.display_order - b.display_order
        ) || [],
    }));

    return listingsWithSortedImages || [];
  },
};
