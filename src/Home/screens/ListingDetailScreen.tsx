import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  HomeStackParamList,
  ProfileStackParamList,
  SearchStackParamList,
} from "../../navigation/types";
import ImageGallery from "../components/ImageGallery";
import { useListing } from "../hooks/useListings";

type Props =
  | NativeStackScreenProps<HomeStackParamList, "HomeDetail">
  | NativeStackScreenProps<ProfileStackParamList, "ProfileDetail">
  | NativeStackScreenProps<SearchStackParamList, "SearchDetail">;

const ListingDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { data: listing, isLoading, error } = useListing(id);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showStickyBar, setShowStickyBar] = useState(false);
  const backButtonOpacity = useSharedValue(1);
  const insets = useSafeAreaInsets();
  const [pricingSectionBottom, setPricingSectionBottom] = useState(0);
  const screenNavigation = useNavigation();

  // Reanimated values for animations
  const stickyBarOpacity = useSharedValue(0);
  const stickyBarTranslateY = useSharedValue(-100);
  const bookingCardScale = useSharedValue(0.9);
  const bookingCardOpacity = useSharedValue(0);

  // Animate sticky bar
  useEffect(() => {
    if (showStickyBar) {
      stickyBarOpacity.value = withTiming(1, { duration: 300 });
      stickyBarTranslateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
    } else {
      stickyBarOpacity.value = withTiming(0, { duration: 200 });
      stickyBarTranslateY.value = withTiming(-100, { duration: 200 });
    }
  }, [showStickyBar]);

  // Animate booking card on mount
  useEffect(() => {
    if (listing) {
      bookingCardScale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
      bookingCardOpacity.value = withTiming(1, { duration: 400 });
    }
  }, [listing]);

  const stickyBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: stickyBarOpacity.value,
    transform: [{ translateY: stickyBarTranslateY.value }],
  }));

  const bookingCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bookingCardOpacity.value,
    transform: [{ scale: bookingCardScale.value }],
  }));

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        // Show sticky bar only when the bottom of pricing section has scrolled past the top
        setShowStickyBar(
          pricingSectionBottom > 0 && offsetY > pricingSectionBottom
        );
        // Fade out back button as user scrolls down
        backButtonOpacity.value =
          offsetY > 100
            ? withTiming(0, { duration: 200 })
            : withTiming(1, { duration: 200 });
      },
    }
  );

  const backButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backButtonOpacity.value,
  }));

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !listing) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Failed to load listing details</Text>
      </View>
    );
  }

  const priceDisplay =
    listing.price_min && listing.price_max
      ? listing.price_min === listing.price_max
        ? `${listing.currency} ${listing.price_min}`
        : `${listing.currency} ${listing.price_min} - ${listing.price_max}`
      : listing.price_min
        ? `${listing.currency} ${listing.price_min}`
        : "Price on request";

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* StatusBar is now controlled globally */}

      {/* Back Button Overlay */}
      <Reanimated.View
        style={[
          styles.backButtonContainer,
          backButtonAnimatedStyle,
          { top: insets.top + 10 },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </Reanimated.View>

      {/* Sticky Top Bar */}
      {showStickyBar && (
        <Reanimated.View
          style={[
            styles.stickyTopBar,
            stickyBarAnimatedStyle,
            { paddingTop: insets.top },
          ]}
        >
          <View style={styles.stickyContent}>
            <View style={styles.stickyLeft}>
              <Text style={styles.stickyPrice}>{priceDisplay}</Text>
              <Text style={styles.stickySubtext}>per person</Text>
            </View>
            <TouchableOpacity style={styles.stickyBookButton}>
              <Text style={styles.stickyBookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </Reanimated.View>
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <ImageGallery images={listing.images || []} />

        {/* Content */}
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {listing.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.title}>{listing.title}</Text>

            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location}>{listing.destination}</Text>
            </View>

            {/* Rating */}
            {listing.rating !== null && listing.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.ratingText}>
                  {listing.rating.toFixed(1)}
                </Text>
                {listing.review_count !== null && listing.review_count > 0 && (
                  <Text style={styles.reviewCount}>
                    · {listing.review_count}{" "}
                    {listing.review_count === 1 ? "review" : "reviews"}
                  </Text>
                )}
              </View>
            )}

            {/* Creator Section */}
            {listing.creator_name && (
              <TouchableOpacity
                style={styles.creatorSection}
                onPress={() => {
                  // Navigate to creator's profile modal
                  (screenNavigation as any).navigate("CreatorProfileModal", {
                    screen: "CreatorProfileMain",
                    params: { userId: listing.creator_id },
                  });
                }}
                activeOpacity={0.7}
              >
                <View style={styles.creatorInfo}>
                  <Text style={styles.creatorLabel}>Hosted by</Text>
                  <Text style={styles.creatorName}>{listing.creator_name}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Quick Info Cards */}
          <View style={styles.quickInfoContainer}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValue}>
                {formatDate(listing.start_date) || "TBA"}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>👥</Text>
              <Text style={styles.infoLabel}>Group Size</Text>
              <Text style={styles.infoValue}>
                Max {listing.max_group_size || "N/A"}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🎯</Text>
              <Text style={styles.infoLabel}>Difficulty</Text>
              <Text style={styles.infoValue}>
                {listing.difficulty
                  ? listing.difficulty.charAt(0).toUpperCase() +
                    listing.difficulty.slice(1)
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Inline Booking Section */}
          <View
            style={styles.inlineBookingSection}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              // Calculate bottom position: Y position + height of the section
              setPricingSectionBottom(layout.y + layout.height);
            }}
          >
            <Reanimated.View
              style={[styles.bookingCard, bookingCardAnimatedStyle]}
            >
              <View style={styles.pricingInfo}>
                <Text style={styles.priceLabel}>Price per person</Text>
                <Text style={styles.priceAmount}>{priceDisplay}</Text>
                {listing.available_spots !== null && (
                  <Text style={styles.spotsText}>
                    {listing.available_spots} spots left
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
              <Text style={styles.instantBookText}>
                {listing.instant_bookable
                  ? "⚡ Instant confirmation"
                  : "📧 Confirmation within 24 hours"}
              </Text>
            </Reanimated.View>
          </View>

          {/* Description */}
          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </View>
          )}

          {/* Details Grid */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              {listing.available_spots !== null && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Available Spots</Text>
                  <Text style={styles.detailValue}>
                    {listing.available_spots} spots
                  </Text>
                </View>
              )}
              {listing.age_range_min !== null &&
                listing.age_range_max !== null && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Age Range</Text>
                    <Text style={styles.detailValue}>
                      {listing.age_range_min} - {listing.age_range_max} years
                    </Text>
                  </View>
                )}
              {listing.start_date && listing.end_date && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(listing.start_date)} -{" "}
                    {formatDate(listing.end_date)}
                  </Text>
                </View>
              )}
              {listing.instant_bookable && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking</Text>
                  <Text style={[styles.detailValue, styles.instantBookable]}>
                    ⚡ Instant Bookable
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Included Items */}
          {listing.included_items &&
            Array.isArray(listing.included_items) &&
            listing.included_items.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>What&apos;s Included</Text>
                {listing.included_items.map((item: any, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.listItemText}>
                      {typeof item === "string"
                        ? item
                        : item.name || item.title || ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Not Included Items */}
          {listing.not_included_items &&
            Array.isArray(listing.not_included_items) &&
            listing.not_included_items.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Not Included</Text>
                {listing.not_included_items.map((item: any, index: number) => (
                  <View key={index} style={styles.listItem}>
                    <Text style={styles.crossmark}>✗</Text>
                    <Text style={styles.listItemText}>
                      {typeof item === "string"
                        ? item
                        : item.name || item.title || ""}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Itinerary */}
          {listing.itinerary &&
            Array.isArray(listing.itinerary) &&
            listing.itinerary.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Itinerary</Text>
                {listing.itinerary.map((day: any, index: number) => {
                  // Handle both string and object formats
                  const dayTitle =
                    typeof day === "string"
                      ? `Day ${index + 1}`
                      : day.title || `Day ${index + 1}`;
                  const dayDescription =
                    typeof day === "string" ? day : day.description || "";

                  return (
                    <View key={index} style={styles.itineraryDay}>
                      <View style={styles.dayNumber}>
                        <Text style={styles.dayNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.dayContent}>
                        <Text style={styles.dayTitle}>{dayTitle}</Text>
                        <Text style={styles.dayDescription}>
                          {dayDescription}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

          {/* Cancellation Policy */}
          {listing.cancellation_policy && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cancellation Policy</Text>
              <Text style={styles.policyText}>
                {listing.cancellation_policy}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButtonContainer: {
    position: "absolute",
    left: 16,
    zIndex: 1000,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  stickyTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stickyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  stickyLeft: {
    flex: 1,
  },
  stickyPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  stickySubtext: {
    fontSize: 12,
    color: "#6B7280",
  },
  stickyBookButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  stickyBookButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heroImage: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  content: {
    paddingBottom: 20,
  },
  headerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    gap: 8,
  },
  tag: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 36,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  location: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  reviewCount: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  creatorSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  creatorInfo: {
    flex: 1,
  },
  creatorLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#4F46E5",
  },
  quickInfoContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  infoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  detailsGrid: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  instantBookable: {
    color: "#10B981",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 16,
    color: "#10B981",
    marginRight: 12,
    fontWeight: "700",
  },
  crossmark: {
    fontSize: 16,
    color: "#EF4444",
    marginRight: 12,
    fontWeight: "700",
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  itineraryDay: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dayNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  dayContent: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  dayDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  policyText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
  inlineBookingSection: {
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pricingInfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  spotsText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
  bookButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  bookButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  instantBookText: {
    fontSize: 13,
    color: "#10B981",
    textAlign: "center",
    fontWeight: "600",
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF4444",
  },
});

export default ListingDetailScreen;
