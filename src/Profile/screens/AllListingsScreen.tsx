import type { Listing } from "@/src/Home/types/listing";
import type {
  CreatorProfileStackParamList,
  ProfileStackParamList,
} from "@/src/navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props =
  | NativeStackScreenProps<ProfileStackParamList, "AllListings">
  | NativeStackScreenProps<
      CreatorProfileStackParamList,
      "CreatorProfileAllListings"
    >;

const AllListingsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { listings, title } = route.params;

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title });
    }, [navigation, title])
  );

  const handleListingPress = (listing: Listing) => {
    // Determine which detail screen to navigate to based on route name
    const routeName = route.name;
    if (routeName === "CreatorProfileAllListings") {
      navigation.navigate("CreatorProfileDetail" as any, { id: listing.id });
    } else {
      navigation.navigate("ProfileDetail", { id: listing.id });
    }
  };

  const ListingCard = ({ listing }: { listing: Listing }) => {
    const imageUrl =
      listing.images && listing.images.length > 0
        ? listing.images[0].url
        : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleListingPress(listing)}
      >
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {listing.title}
          </Text>
          <Text style={styles.cardDestination} numberOfLines={1}>
            {listing.destination}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>
              ${listing.price_min || 0}-${listing.price_max || 0}
            </Text>
            {listing.rating && (
              <Text style={styles.cardRating}>{listing.rating}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={({ item }) => <ListingCard listing={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No listings found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 12,
    paddingBottom: 24,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#f3f4f6",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDestination: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  cardRating: {
    fontSize: 11,
    fontWeight: "600",
    backgroundColor: "#fef3c7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9ca3af",
  },
});

export default AllListingsScreen;
