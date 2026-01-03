import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../utils/supabase";

export interface Booking {
  id: string;
  listing_id: string;
  traveler_id: string;
  agent_id: string;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "accepted"
    | "rejected";
  traveler_notes: string | null;
  requested_at: string;
  accepted_at?: string | null;
  confirmed_at?: string | null;
  conversation_id: string | null;
  created_at: string;
  updated_at: string;
  // Joined data from listings table
  listing?: {
    id: string;
    title: string;
    destination: string;
    price_min: number;
    price_max: number;
    currency: string;
    start_date: string;
    end_date: string;
    max_group_size?: number;
    cancellation_policy?: string | null;
    images?: { url: string }[];
  };
}

export const useBookings = (userId?: string) => {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const { data, error } = await supabase
        .from("travel_group_bookings")
        .select(
          `
          *,
          listing:listings (
            id,
            title,
            destination,
            price_min,
            price_max,
            currency,
            start_date,
            end_date,
            images (url)
          )
        `
        )
        .eq("traveler_id", userId)
        .order("requested_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []) as Booking[];
    },
    enabled: !!userId,
  });
};
