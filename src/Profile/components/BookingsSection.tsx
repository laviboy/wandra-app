import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Booking } from "../hooks/useBookings";
import BookingCard from "./BookingCard";

interface BookingsSectionProps {
  bookings: Booking[];
  isLoading: boolean;
  onBookingPress: (booking: Booking) => void;
  onViewAll?: () => void;
}

const BookingsSection: React.FC<BookingsSectionProps> = ({
  bookings,
  isLoading,
  onBookingPress,
  onViewAll,
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Bookings</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </View>
    );
  }

  // Show empty state
  if (!bookings || bookings.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Bookings</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>
            Book your first adventure to get started!
          </Text>
        </View>
      </View>
    );
  }

  // Show bookings with preview (max 3)
  const previewBookings = bookings.slice(0, 3);
  const hasMore = bookings.length > 3;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>Your Bookings</Text>
          <Text style={styles.sectionSubtitle}>
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </Text>
        </View>
        {hasMore && onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.bookingsList}>
        {previewBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onPress={onBookingPress}
          />
        ))}
      </View>

      {hasMore && onViewAll && (
        <TouchableOpacity
          style={styles.showMoreButton}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.showMoreText}>
            Show {bookings.length - 3} more{" "}
            {bookings.length - 3 === 1 ? "booking" : "bookings"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  viewAllButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
  bookingsList: {
    gap: 12,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  showMoreButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F46E5",
  },
});

export default BookingsSection;
