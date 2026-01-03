import { supabase } from "../../../utils/supabase";

export interface CreateBookingPayload {
  listingId: string;
  travelerNotes: string;
}

export interface Booking {
  id: string;
  listing_id: string;
  traveler_id: string;
  agent_id: string;
  traveler_notes: string;
  status: string;
  requested_at: string;
  conversation_id?: string;
  created_at: string;
  updated_at: string;
}

export const createBooking = async (data: CreateBookingPayload) => {
  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { listingId, travelerNotes } = data;

  if (!listingId) {
    throw new Error("Listing ID is required");
  }

  // Get the listing to find the agent
  const { data: listing, error: listingError } = await supabase
    .from("listings")
    .select("id, title, creator_id, price_min")
    .eq("id", listingId)
    .single();

  if (listingError || !listing) {
    throw new Error("Listing not found");
  }

  // Check if user already has a booking for this listing
  const { data: existingBooking } = await supabase
    .from("travel_group_bookings")
    .select("id")
    .eq("listing_id", listingId)
    .eq("traveler_id", session.user.id)
    .single();

  if (existingBooking) {
    throw new Error("You already have a booking for this travel group");
  }

  // Create the booking
  const { data: booking, error: bookingError } = await supabase
    .from("travel_group_bookings")
    .insert({
      listing_id: listingId,
      traveler_id: session.user.id,
      agent_id: listing.creator_id,
      status: "pending",
      traveler_notes: travelerNotes,
      requested_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (bookingError || !booking) {
    console.error("Error creating booking:", bookingError);
    throw new Error("Failed to create booking");
  }

  // Create a conversation between traveler and agent
  const conversationId = `conv_${booking.id}_${Date.now()}`;
  const { error: convError } = await supabase.from("conversations").insert({
    id: conversationId,
    customer_id: session.user.id,
    agent_id: listing.creator_id,
    listing_id: listing.id,
    type: "booking",
    subject: `Travel Group: ${listing.title}`,
    last_message: travelerNotes || "Booking request",
    last_message_at: new Date().toISOString(),
  });

  if (convError) {
    console.error("Error creating conversation:", convError);
  } else {
    // Link the conversation to the booking
    const { error: updateError } = await supabase
      .from("travel_group_bookings")
      .update({ conversation_id: conversationId })
      .eq("id", booking.id);

    if (updateError) {
      console.error("Error linking conversation to booking:", updateError);
    }
  }

  // Create a notification for the agent
  const { error: notifError } = await supabase.from("notifications").insert({
    user_id: listing.creator_id,
    type: "booking_request",
    title: "New Booking Request",
    message: `${session.user.email} wants to join your travel group: ${listing.title}`,
    related_id: String(booking.id),
    related_type: "booking",
    action_url: `/crm/travel-bookings'`,
    read: false,
  });

  if (notifError) {
    console.error("Error creating notification:", notifError);
  }

  return booking;
};
