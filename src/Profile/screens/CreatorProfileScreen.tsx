import { authApi } from "@/src/Auth/api/authApi";
import type { User } from "@/src/Auth/types/auth";
import { listingsApi } from "@/src/Home/api/listingsApi";
import type { Listing } from "@/src/Home/types/listing";
import type { CreatorProfileStackParamList } from "@/src/navigation/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListingsSection, ProfileHeader, StatsSection } from "../components";

interface StatItem {
  label: string;
  value: number;
  icon: string;
}

const CreatorProfileScreen: React.FC<
  NativeStackScreenProps<CreatorProfileStackParamList, "CreatorProfileMain">
> = ({ navigation, route }) => {
  const { userId } = route.params;
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [user, setUser] = useState<User | null>(null);
  const [createdListings, setCreatedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userData = await authApi.getUserById(userId);
        setUser(userData as User);

        // Fetch listings for the user
        const allListings = await listingsApi.getListings();
        const userListings = allListings.filter(
          (listing) => listing.creator_id === userId
        );
        setCreatedListings(userListings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Set navigation header with user name
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: user?.name || "Profile",
      headerTintColor: "#007AFF",
    });
  }, [user?.name, navigation]);

  const stats: StatItem[] = [
    { label: "Listings", value: createdListings.length, icon: "📍" },
    { label: "Trips", value: 0, icon: "✈️" },
    { label: "Rating", value: 4.8, icon: "⭐" },
    { label: "Followers", value: 128, icon: "👥" },
  ];

  const handleListingTilePress = (listing: Listing) => {
    // Navigate to listing detail within this stack
    navigation.navigate("CreatorProfileDetail", { id: listing.id });
  };

  const handleViewAllPress = (listings: Listing[], title: string) => {
    // Navigate to all listings screen with data
    navigation.navigate("CreatorProfileAllListings", { listings, title });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom }}
    >
      <ProfileHeader name={user?.name || "User"} email={user?.email || ""} />
      <StatsSection stats={stats} />

      <ListingsSection
        title={`${user?.name}'s Listings`}
        listings={createdListings}
        onViewAll={() =>
          handleViewAllPress(createdListings, `${user?.name}'s Listings`)
        }
        onListingPress={handleListingTilePress}
        emptyMessage="No listings created by this user"
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

export default CreatorProfileScreen;
