import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TripCountdownProps {
  startDate: Date;
}

const TripCountdown: React.FC<TripCountdownProps> = ({ startDate }) => {
  const now = new Date();
  const diffTime = startDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) {
    return null;
  }

  if (diffDays < 0) {
    return (
      <View style={styles.pastTripContainer}>
        <Text style={styles.pastTripText}>Trip has started</Text>
      </View>
    );
  }

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return (
    <LinearGradient
      colors={["#F43F5E", "#EC4899"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.header}>
        <Ionicons name="time-outline" size={20} color="#FFFFFF" />
        <Text style={styles.headerText}>Trip Countdown</Text>
      </View>

      <View style={styles.countdownRow}>
        <Text style={styles.countdownNumber}>{diffDays}</Text>
        <Text style={styles.countdownLabel}>days to go</Text>
      </View>

      {weeks > 0 && (
        <Text style={styles.weeksText}>
          That&apos;s {weeks} week{weeks > 1 ? "s" : ""}{" "}
          {days > 0 ? `and ${days} day${days > 1 ? "s" : ""}` : ""}
        </Text>
      )}

      <Text style={styles.dateText}>
        Departure:{" "}
        {startDate.toLocaleDateString("en-MY", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  pastTripContainer: {
    padding: 16,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    alignItems: "center",
  },
  pastTripText: {
    fontSize: 14,
    color: "#64748B",
  },
  gradient: {
    borderRadius: 12,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  countdownRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  countdownNumber: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  countdownLabel: {
    fontSize: 18,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  weeksText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
    marginTop: 8,
  },
});

export default TripCountdown;
