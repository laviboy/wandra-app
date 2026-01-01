import type { Listing } from "@/src/Home/types/listing";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ListingTileProps {
  listing: Listing;
  onPress: (listing: Listing) => void;
}

const ListingTile: React.FC<ListingTileProps> = ({ listing, onPress }) => {
  const imageUrl =
    listing.images && listing.images.length > 0
      ? listing.images[0].url
      : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80";

  return (
    <TouchableOpacity
      style={styles.listingTile}
      onPress={() => onPress(listing)}
    >
      <Image source={{ uri: imageUrl }} style={styles.tileImage} />
      <View style={styles.tileContent}>
        <Text style={styles.tileTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.tileDestination} numberOfLines={1}>
          {listing.destination}
        </Text>
        <View style={styles.tileFooter}>
          <Text style={styles.tilePrice}>
            {listing.currency}
            {listing.price_min}-{listing.currency}
            {listing.price_max}
          </Text>
          {listing.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{listing.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listingTile: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tileImage: {
    width: "100%",
    height: 100,
    backgroundColor: "#f3f4f6",
  },
  tileContent: {
    padding: 10,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  tileDestination: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  tileFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tilePrice: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0a7ea4",
  },
  ratingBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export default ListingTile;
