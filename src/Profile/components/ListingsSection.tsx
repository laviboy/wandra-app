import type { Listing } from "@/src/Home/types/listing";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ListingTile from "./ListingTile";

interface ListingsSectionProps {
  title: string;
  listings: Listing[];
  onViewAll: () => void;
  onListingPress: (listing: Listing) => void;
  emptyMessage: string;
}

const ListingsSection: React.FC<ListingsSectionProps> = ({
  title,
  listings,
  onViewAll,
  onListingPress,
  emptyMessage,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {listings.length > 0 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>
      {listings.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.listingScroll}
        >
          {listings.map((listing) => (
            <ListingTile
              key={listing.id}
              listing={listing}
              onPress={onListingPress}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{emptyMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
  },
  viewAllText: {
    fontSize: 12,
    color: "#0a7ea4",
    fontWeight: "500",
  },
  listingScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});

export default ListingsSection;
