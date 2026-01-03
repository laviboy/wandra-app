import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { PaymentMilestone } from "../types/payment";

interface PaymentTimelineProps {
  milestones: PaymentMilestone[];
  onPayNow?: (milestoneId: number, amount: number) => void;
}

const PaymentTimeline: React.FC<PaymentTimelineProps> = ({
  milestones,
  onPayNow,
}) => {
  const totalPaid = milestones
    .filter((m) => m.status === "paid")
    .reduce((sum, m) => sum + m.amount, 0);
  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const progressPercentage =
    totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;

  const getStatusColor = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "paid":
        return "#10B981";
      case "current":
        return "#F59E0B";
      case "upcoming":
        return "#E5E7EB";
      case "overdue":
        return "#EF4444";
    }
  };

  const getStatusBgColor = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "paid":
        return "#D1FAE5";
      case "current":
        return "#FEF3C7";
      case "upcoming":
        return "#F9FAFB";
      case "overdue":
        return "#FEE2E2";
    }
  };

  const getStatusTextColor = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "paid":
        return "#065F46";
      case "current":
        return "#92400E";
      case "upcoming":
        return "#6B7280";
      case "overdue":
        return "#991B1B";
    }
  };

  const getStatusLabel = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "current":
        return "Due Now";
      case "upcoming":
        return "Upcoming";
      case "overdue":
        return "Overdue";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* Progress Overview */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTitle}>Payment Progress</Text>
            <Text style={styles.progressSubtitle}>
              RM {totalPaid.toLocaleString()} of RM{" "}
              {totalAmount.toLocaleString()} paid
            </Text>
          </View>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>
      </View>

      {/* Timeline */}
      <View style={styles.timeline}>
        {milestones.map((milestone, index) => {
          const isLast = index === milestones.length - 1;
          const statusColor = getStatusColor(milestone.status);
          const statusBgColor = getStatusBgColor(milestone.status);
          const statusTextColor = getStatusTextColor(milestone.status);

          return (
            <View key={milestone.id} style={styles.timelineItem}>
              <View style={styles.timelineIconColumn}>
                <View
                  style={[
                    styles.timelineIcon,
                    { backgroundColor: statusColor },
                  ]}
                >
                  {milestone.status === "paid" ? (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  ) : milestone.status === "overdue" ? (
                    <Ionicons name="alert" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.timelineIconText}>{milestone.id}</Text>
                  )}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.timelineLine,
                      {
                        backgroundColor:
                          milestone.status === "paid" ? "#A7F3D0" : "#E5E7EB",
                      },
                    ]}
                  />
                )}
              </View>

              <View style={styles.timelineContent}>
                <View
                  style={[
                    styles.milestoneCard,
                    { backgroundColor: statusBgColor },
                  ]}
                >
                  <View style={styles.milestoneHeader}>
                    <View style={styles.milestoneInfo}>
                      <View style={styles.milestoneTitleRow}>
                        <Text style={styles.milestoneTitle}>
                          {milestone.name}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              { color: statusTextColor },
                            ]}
                          >
                            {getStatusLabel(milestone.status)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.milestoneDescription}>
                        {milestone.description}
                      </Text>
                      <Text style={styles.milestoneDueDate}>
                        Due: {formatDate(milestone.dueDate)}
                      </Text>
                    </View>
                    <View style={styles.milestoneAmount}>
                      <Text style={styles.amountText}>
                        RM {milestone.amount.toLocaleString()}
                      </Text>
                      <Text style={styles.percentageText}>
                        {milestone.percentage}% of total
                      </Text>
                    </View>
                  </View>

                  {(milestone.status === "current" ||
                    milestone.status === "overdue") &&
                    onPayNow && (
                      <TouchableOpacity
                        style={[
                          styles.payButton,
                          {
                            backgroundColor:
                              milestone.status === "overdue"
                                ? "#EF4444"
                                : "#F59E0B",
                          },
                        ]}
                        onPress={() => onPayNow(milestone.id, milestone.amount)}
                      >
                        <Text style={styles.payButtonText}>
                          {milestone.status === "overdue"
                            ? "Pay Now (Overdue)"
                            : "Pay Now"}
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  progressCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  progressPercentage: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10B981",
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 6,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineIconText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 60,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  milestoneCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  milestoneDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  milestoneDueDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  milestoneAmount: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  payButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});

export default PaymentTimeline;
