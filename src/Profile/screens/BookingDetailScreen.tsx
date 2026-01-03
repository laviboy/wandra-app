import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../Auth/hooks/useAuthStore";
import type { ProfileStackParamList } from "../../navigation/types";
import PaymentForm from "../components/PaymentForm";
import PaymentTimeline from "../components/PaymentTimeline";
import TripCountdown from "../components/TripCountdown";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { calculatePaymentMilestones } from "../types/payment";

type Props = NativeStackScreenProps<ProfileStackParamList, "BookingDetail">;

const BookingDetailScreen = ({ route, navigation }: Props) => {
  const { id } = route.params;
  const { data: booking, isLoading } = useBookingDetail(id);
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<{
    id: number;
    amount: number;
  } | null>(null);

  // Calculate payment milestones
  const tripStartDate = useMemo(() => {
    if (!booking?.listing?.start_date) return null;
    const date = new Date(booking.listing.start_date);
    return isNaN(date.getTime()) ? null : date;
  }, [booking?.listing?.start_date]);

  const totalPrice = booking?.listing?.price_min || 1000;

  const paymentMilestones = useMemo(
    () =>
      calculatePaymentMilestones(
        totalPrice,
        tripStartDate,
        booking?.status || "pending",
        booking?.payment_status || undefined,
        booking?.deposit_paid || undefined
      ),
    [
      totalPrice,
      tripStartDate,
      booking?.status,
      booking?.payment_status,
      booking?.deposit_paid,
    ]
  );

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setCurrentMilestone(null);
    // Refetch booking data to update payment status
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      { label: string; color: string; bgColor: string; icon: string }
    > = {
      pending: {
        label: "Pending",
        color: "#F59E0B",
        bgColor: "#FEF3C7",
        icon: "time-outline",
      },
      confirmed: {
        label: "Confirmed",
        color: "#10B981",
        bgColor: "#D1FAE5",
        icon: "checkmark-circle",
      },
      accepted: {
        label: "Accepted",
        color: "#10B981",
        bgColor: "#D1FAE5",
        icon: "checkmark-circle",
      },
      cancelled: {
        label: "Cancelled",
        color: "#EF4444",
        bgColor: "#FEE2E2",
        icon: "close-circle",
      },
      rejected: {
        label: "Rejected",
        color: "#EF4444",
        bgColor: "#FEE2E2",
        icon: "close-circle",
      },
      completed: {
        label: "Completed",
        color: "#6366F1",
        bgColor: "#E0E7FF",
        icon: "flag",
      },
    };
    return (
      configs[status] || {
        label: status,
        color: "#6B7280",
        bgColor: "#F3F4F6",
        icon: "information-circle",
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${days} days ${days - 1} nights`;
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Booking not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const isTraveler = user?.id === booking.traveler_id;
  const imageUrl =
    booking.listing?.images && booking.listing.images.length > 0
      ? booking.listing.images[0].url
      : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.headerBackButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusConfig.bgColor },
            ]}
          >
            <Ionicons
              name={statusConfig.icon as any}
              size={16}
              color={statusConfig.color}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={styles.bookingId}>
            Booking #{booking.id ? String(booking.id).slice(0, 8) : "N/A"}
          </Text>
        </View>

        {/* Trip Image & Info */}
        <View style={styles.tripCard}>
          <Image source={{ uri: imageUrl }} style={styles.tripImage} />
          <View style={styles.tripInfo}>
            <Text style={styles.tripTitle}>{booking.listing?.title}</Text>
            <View style={styles.tripLocation}>
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text style={styles.tripLocationText}>
                {booking.listing?.destination}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Details Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Ionicons name="calendar-outline" size={20} color="#4F46E5" />
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailValue}>
                {booking.listing?.start_date
                  ? formatDate(booking.listing.start_date)
                  : "TBA"}
              </Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="time-outline" size={20} color="#4F46E5" />
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>
                {booking.listing?.start_date && booking.listing?.end_date
                  ? calculateDuration(
                      booking.listing.start_date,
                      booking.listing.end_date
                    )
                  : "TBA"}
              </Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="people-outline" size={20} color="#4F46E5" />
              <Text style={styles.detailLabel}>Group Size</Text>
              <Text style={styles.detailValue}>
                {booking.listing?.max_group_size || 10} max
              </Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="cash-outline" size={20} color="#4F46E5" />
              <Text style={styles.detailLabel}>Price</Text>
              <Text style={styles.detailValue}>
                {booking.listing?.currency} {booking.listing?.price_min}
              </Text>
            </View>
          </View>
        </View>

        {/* Trip Countdown */}
        {tripStartDate &&
          ["confirmed", "accepted"].includes(booking.status) && (
            <View style={styles.section}>
              <TripCountdown startDate={tripStartDate} />
            </View>
          )}

        {/* Payment Schedule */}
        <View style={styles.section}>
          <View style={styles.paymentHeader}>
            <Ionicons name="cash-outline" size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Payment Schedule</Text>
          </View>
          <Text style={styles.paymentSubtitle}>
            Your payment is split into 3 easy installments
          </Text>
          <PaymentTimeline
            milestones={paymentMilestones}
            onPayNow={
              isTraveler &&
              ["pending_payment", "accepted"].includes(booking.status)
                ? (milestoneId: number, amount: number) => {
                    setCurrentMilestone({ id: milestoneId, amount });
                    setShowPaymentForm(true);
                  }
                : undefined
            }
          />
        </View>

        {/* Payment Form Modal */}
        {showPaymentForm && currentMilestone && (
          <View style={styles.paymentFormContainer}>
            <PaymentForm
              bookingId={booking.id}
              amount={currentMilestone.amount}
              milestoneId={currentMilestone.id}
              onSuccess={handlePaymentSuccess}
              onCancel={() => {
                setShowPaymentForm(false);
                setCurrentMilestone(null);
              }}
            />
          </View>
        )}

        {/* Booking Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Timeline</Text>
          <View style={styles.timeline}>
            <TimelineItem
              completed
              title="Request Submitted"
              date={formatDateTime(booking.requested_at)}
              showLine
              icon="paper-plane"
            />
            <TimelineItem
              completed={!!booking.accepted_at}
              pending={!booking.accepted_at}
              title="Accepted by Agent"
              date={
                booking.accepted_at
                  ? formatDateTime(booking.accepted_at)
                  : "Pending"
              }
              showLine
              icon="checkmark-done"
            />
            <TimelineItem
              completed={booking.status === "confirmed"}
              pending={booking.status !== "confirmed"}
              title="Trip Confirmed"
              date={booking.status === "confirmed" ? "Confirmed" : "Pending"}
              showLine={false}
              icon="flag"
            />
          </View>
        </View>

        {/* Traveler Notes */}
        {booking.traveler_notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Message to Agent</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{booking.traveler_notes}</Text>
            </View>
          </View>
        )}

        {/* Cancellation Policy */}
        {booking.listing?.cancellation_policy && (
          <View style={styles.section}>
            <View style={styles.policyCard}>
              <View style={styles.policyHeader}>
                <Ionicons name="shield-checkmark" size={20} color="#D97706" />
                <Text style={styles.policyTitle}>Cancellation Policy</Text>
              </View>
              <Text style={styles.policyText}>
                {booking.listing.cancellation_policy}
              </Text>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // Navigate to listing detail
              if (booking.listing_id) {
                navigation.navigate("ProfileDetail", {
                  id: booking.listing_id,
                });
              }
            }}
          >
            <Ionicons name="information-circle" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>View Full Trip Details</Text>
          </TouchableOpacity>

          {isTraveler &&
            !["cancelled", "rejected"].includes(booking.status) && (
              <TouchableOpacity
                style={styles.dangerButton}
                onPress={() => {
                  // TODO: Implement cancel booking
                  console.log("Cancel booking");
                }}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
                <Text style={styles.dangerButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
        </View>
      </ScrollView>
    </View>
  );
};

// Timeline Item Component
interface TimelineItemProps {
  completed?: boolean;
  pending?: boolean;
  title: string;
  date: string;
  showLine: boolean;
  icon: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  completed,
  pending,
  title,
  date,
  showLine,
  icon,
}) => {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIconColumn}>
        <View
          style={[
            styles.timelineIcon,
            completed
              ? styles.timelineIconCompleted
              : styles.timelineIconPending,
          ]}
        >
          <Ionicons
            name={icon as any}
            size={16}
            color={completed ? "#fff" : "#9CA3AF"}
          />
        </View>
        {showLine && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text
          style={[styles.timelineTitle, pending && styles.timelineTitlePending]}
        >
          {title}
        </Text>
        <Text
          style={[styles.timelineDate, pending && styles.timelineDatePending]}
        >
          {date}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerBackButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },
  statusBanner: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  bookingId: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
  tripCard: {
    backgroundColor: "#fff",
    marginTop: 8,
    overflow: "hidden",
  },
  tripImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  tripInfo: {
    padding: 16,
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  tripLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tripLocationText: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
    textAlign: "center",
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 12,
  },
  timelineIconColumn: {
    alignItems: "center",
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineIconCompleted: {
    backgroundColor: "#10B981",
  },
  timelineIconPending: {
    backgroundColor: "#E5E7EB",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 12,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  timelineTitlePending: {
    color: "#9CA3AF",
  },
  timelineDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  timelineDatePending: {
    color: "#9CA3AF",
  },
  notesCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  notesText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  policyCard: {
    backgroundColor: "#FEF3C7",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  policyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
  },
  policyText: {
    fontSize: 13,
    color: "#78350F",
    lineHeight: 20,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#EF4444",
  },
  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  paymentFormContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default BookingDetailScreen;
