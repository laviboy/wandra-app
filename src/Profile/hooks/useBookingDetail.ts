import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../utils/supabase";
import type { Booking } from "./useBookings";

export const useBookingDetail = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
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
            max_group_size,
            cancellation_policy,
            images (url)
          )
        `
        )
        .eq("id", bookingId)
        .single();

      if (error) {
        throw error;
      }

      return data as Booking;
    },
    enabled: !!bookingId,
  });
};
