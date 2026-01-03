import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Booking } from "../hooks/useBookings";

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const imageUrl =
    booking.listing?.images && booking.listing.images.length > 0
      ? booking.listing.images[0].url
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      case "completed":
        return "#6366F1";
      default:
        return "#6B7280";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(booking)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {booking.listing?.title || "Untitled Trip"}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(booking.status)}15` },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(booking.status) },
              ]}
            >
              {getStatusLabel(booking.status)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.icon}>📍</Text>
          <Text style={styles.destination} numberOfLines={1}>
            {booking.listing?.destination || "Location TBA"}
          </Text>
        </View>

        {booking.listing?.start_date && (
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.date}>
              {formatDate(booking.listing.start_date)}
              {booking.listing.end_date &&
                ` - ${formatDate(booking.listing.end_date)}`}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>
            {booking.listing?.currency} {booking.listing?.price_min}
            {booking.listing?.price_max &&
            booking.listing.price_min !== booking.listing.price_max
              ? ` - ${booking.listing.currency} ${booking.listing.price_max}`
              : ""}
          </Text>
          <Text style={styles.requestedDate}>
            Requested {formatDate(booking.requested_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  destination: {
    flex: 1,
    fontSize: 13,
    color: "#6B7280",
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  },
  requestedDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});

export default BookingCard;
