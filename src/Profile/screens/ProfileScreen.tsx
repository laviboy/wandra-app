import { useAuth } from "@/src/Auth/hooks/useAuth";
import { listingsApi } from "@/src/Home/api/listingsApi";
import type { Listing } from "@/src/Home/types/listing";
import type { ProfileStackParamList } from "@/src/navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  AccountStatusSection,
  ActionButtons,
  BookingsSection,
  ListingsSection,
  ProfileHeader,
  StatsSection,
} from "../components";
import { useBookings } from "../hooks/useBookings";

interface StatItem {
  label: string;
  value: number;
  icon: string;
}

interface AccountStatus {
  label: string;
  verified: boolean;
}

const ProfileScreen: React.FC<
  NativeStackScreenProps<ProfileStackParamList, "ProfileMain">
> = ({ navigation }) => {
  const { user: currentUser, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [createdListings, setCreatedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user bookings
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useBookings(currentUser?.id);

  // Mock joined and upcoming listings
  const joinedListings: Listing[] = [
    {
      id: "joined-1",
      creator_id: "other-user",
      title: "Mountain Hiking Expedition",
      destination: "Swiss Alps",
      short_description: "Explore breathtaking mountain trails",
      price_min: 1200,
      price_max: 1500,
      currency: "USD",
      start_date: "2026-03-15",
      rating: 4.8,
      review_count: 45,
      difficulty: "challenging",
      max_group_size: 12,
      available_spots: 3,
      description: null,
      tags: ["hiking", "mountains"],
      instant_bookable: true,
      status: "active",
      end_date: "2026-03-22",
      age_range_min: 18,
      age_range_max: 65,
      included_items: null,
      not_included_items: null,
      itinerary: null,
      cancellation_policy: null,
      created_at: "2025-12-01",
      updated_at: "2025-12-01",
      images: [],
    },
  ];

  const upcomingListings: Listing[] = [
    {
      id: "upcoming-1",
      creator_id: "other-user",
      title: "Tropical Beach Retreat",
      destination: "Bali, Indonesia",
      short_description: "Relax on pristine sandy beaches",
      price_min: 800,
      price_max: 1100,
      currency: "USD",
      start_date: "2026-04-10",
      rating: 4.9,
      review_count: 67,
      difficulty: "easy",
      max_group_size: 20,
      available_spots: 5,
      description: null,
      tags: ["beach", "relaxation"],
      instant_bookable: true,
      status: "active",
      end_date: "2026-04-17",
      age_range_min: 16,
      age_range_max: 75,
      included_items: null,
      not_included_items: null,
      itinerary: null,
      cancellation_policy: null,
      created_at: "2025-11-15",
      updated_at: "2025-11-15",
      images: [],
    },
  ];

  const fetchCreatedListings = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const allListings = await listingsApi.getListings();
      const userListings = allListings.filter(
        (listing) => listing.creator_id === currentUser?.id
      );
      setCreatedListings(userListings);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  // Fetch data on mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchCreatedListings();
    }
  }, [currentUser?.id, fetchCreatedListings]);

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (currentUser?.id) {
        refetchBookings();
        fetchCreatedListings();
      }
    }, [currentUser?.id, refetchBookings, fetchCreatedListings])
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchBookings(), fetchCreatedListings()]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchBookings, fetchCreatedListings]);

  const stats: StatItem[] = [
    { label: "Listings", value: createdListings.length, icon: "📍" },
    {
      label: "Trips",
      value: joinedListings.length + upcomingListings.length,
      icon: "✈️",
    },
    { label: "Rating", value: 4.8, icon: "⭐" },
    { label: "Followers", value: 128, icon: "👥" },
  ];

  const accountStatuses: AccountStatus[] = [
    { label: "Email Verified", verified: true },
    { label: "ID Verified", verified: true },
    { label: "2FA Enabled", verified: false },
    { label: "Phone Verified", verified: true },
  ];

  const handleListingTilePress = (listing: Listing) => {
    navigation.navigate("ProfileDetail", { id: listing.id });
  };

  const handleViewAllPress = (listings: Listing[], title: string) => {
    navigation.navigate("AllListings", { listings, title });
  };

  const handleBookingPress = (booking: any) => {
    // Navigate to booking detail screen
    navigation.navigate("BookingDetail", { id: booking.id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  // console.log(currentUser);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={["#4F46E5"]}
        />
      }
    >
      <ProfileHeader
        name={currentUser?.name || "User"}
        email={currentUser?.email || ""}
      />
      <StatsSection stats={stats} />

      <BookingsSection
        bookings={bookings}
        isLoading={bookingsLoading}
        onBookingPress={handleBookingPress}
      />

      <ListingsSection
        title="Your Listings"
        listings={createdListings}
        onViewAll={() => handleViewAllPress(createdListings, "Your Listings")}
        onListingPress={handleListingTilePress}
        emptyMessage="No listings created yet"
      />

      <ListingsSection
        title="Trips Joined"
        listings={joinedListings}
        onViewAll={() => handleViewAllPress(joinedListings, "Trips Joined")}
        onListingPress={handleListingTilePress}
        emptyMessage="No trips joined yet"
      />

      <ListingsSection
        title="Upcoming"
        listings={upcomingListings}
        onViewAll={() => handleViewAllPress(upcomingListings, "Upcoming Trips")}
        onListingPress={handleListingTilePress}
        emptyMessage="No upcoming trips"
      />

      <AccountStatusSection statuses={accountStatuses} />

      <ActionButtons
        onSettingsPress={() => {
          // TODO: Navigate to settings
        }}
        onLogoutPress={() => logout()}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});

export default ProfileScreen;
