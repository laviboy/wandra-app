import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "../api/listingsApi";

export const useListings = () => {
  return useQuery({
    queryKey: ["listings"],
    queryFn: listingsApi.getListings,
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getListingById(id),
    enabled: !!id,
  });
};

export const useSearchListings = (query: string) => {
  return useQuery({
    queryKey: ["listings", "search", query],
    queryFn: () => listingsApi.searchListings(query),
    enabled: query.length > 0,
  });
};
