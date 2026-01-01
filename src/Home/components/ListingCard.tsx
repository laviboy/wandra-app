import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Listing } from "../types/listing";

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {
  const {
    title,
    destination,
    short_description,
    tags,
    price_min,
    price_max,
    currency = "USD",
    start_date,
    available_spots,
    rating,
    review_count,
    difficulty,
    images,
  } = listing;

  // Get the first image or use placeholder
  const imageUrl =
    images && images.length > 0
      ? images[0].url
      : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80";

  // Format price display
  const priceDisplay =
    price_min && price_max
      ? price_min === price_max
        ? `${currency} ${price_min}`
        : `${currency} ${price_min} - ${price_max}`
      : price_min
        ? `${currency} ${price_min}`
        : "Price on request";

  // Format date
  const formattedDate = start_date
    ? new Date(start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  // Check if spots are limited
  const isLimitedSpots = available_spots !== null && available_spots <= 5;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Overlay badges */}
        <View style={styles.badgeContainer}>
          {isLimitedSpots && (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>
                Only {available_spots} spots left!
              </Text>
            </View>
          )}
          {tags && tags[0] && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{tags[0]}</Text>
            </View>
          )}
        </View>

        {/* Difficulty badge */}
        {difficulty && (
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title and Location */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.location} numberOfLines={1}>
              {destination}
            </Text>
          </View>
        </View>

        {/* Description */}
        {short_description && (
          <Text style={styles.description} numberOfLines={2}>
            {short_description}
          </Text>
        )}

        {/* Rating */}
        {rating !== null && rating > 0 && (
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
            {review_count !== null && review_count > 0 && (
              <Text style={styles.reviewCount}>
                ({review_count} {review_count === 1 ? "review" : "reviews"})
              </Text>
            )}
          </View>
        )}

        {/* Footer: Date and Price */}
        <View style={styles.footer}>
          {formattedDate && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.date}>{formattedDate}</Text>
            </View>
          )}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{priceDisplay}</Text>
            <Text style={styles.perPerson}>per person</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  urgencyBadge: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  urgencyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  tagBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: "#1F2937",
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  difficultyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
    lineHeight: 26,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 13,
    color: "#6B7280",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  date: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "600",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  perPerson: {
    fontSize: 12,
    color: "#6B7280",
  },
});

export default ListingCard;
