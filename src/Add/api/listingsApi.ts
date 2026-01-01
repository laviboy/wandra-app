import { supabase } from "../../../utils/supabase";
import { CreateListingPayload } from "../types/listing";

export const createListing = async (
  data: CreateListingPayload,
  userId: string,
  photos: { url: string; storage_path: string }[] = []
) => {
  // Generate a simple UUID for React Native (alternative to crypto.randomUUID)
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const listingId = generateUUID();

  // Create listing
  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      ...data,
      creator_id: userId,
      id: listingId,
    })
    .select()
    .single();

  if (error) throw error;

  // Create image records if photos exist
  if (photos.length > 0) {
    const imageRecords = photos.map((photo, index) => ({
      id: generateUUID(),
      listing_id: listingId,
      url: photo.url,
      storage_path: photo.storage_path,
      display_order: index,
      caption: null,
    }));

    const { error: imagesError } = await supabase
      .from("images")
      .insert(imageRecords);

    if (imagesError) {
      console.error("Failed to create image records:", imagesError);
      // Note: Listing is already created, so we don't throw here
      // Images can be added later if needed
    }
  }

  return listing;
};

export const updateListing = async (
  listingId: string,
  data: Partial<CreateListingPayload>
) => {
  const { data: listing, error } = await supabase
    .from("listings")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId)
    .select()
    .single();

  if (error) throw error;
  return listing;
};

export const uploadListingImage = async (
  listingId: string,
  imageUri: string,
  displayOrder: number
) => {
  // This is a placeholder - you'll need to implement actual image upload
  // using Expo's ImagePicker and Supabase storage
  const filename = `${listingId}/${Date.now()}.jpg`;

  // Upload to Supabase storage
  // const { data, error } = await supabase.storage
  //   .from('listing-images')
  //   .upload(filename, file);

  // Then create a record in listing_images table
  const { data: image, error } = await supabase
    .from("listing_images")
    .insert({
      listing_id: listingId,
      url: imageUri, // Replace with actual storage URL
      storage_path: filename,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) throw error;
  return image;
};
