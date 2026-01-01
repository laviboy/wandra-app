import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface AccountStatus {
  label: string;
  verified: boolean;
}

interface AccountStatusSectionProps {
  statuses: AccountStatus[];
}

const AccountStatusSection: React.FC<AccountStatusSectionProps> = ({
  statuses,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Account Status</Text>
      <View style={styles.statusGrid}>
        {statuses.map((status, index) => (
          <View
            key={index}
            style={[
              styles.statusItem,
              {
                borderLeftColor: status.verified ? "#10b981" : "#ef4444",
              },
            ]}
          >
            <View style={styles.statusCheckbox}>
              <Text style={styles.statusIcon}>
                {status.verified ? "✓" : ""}
              </Text>
            </View>
            <Text style={styles.statusLabel}>{status.label}</Text>
            <Text
              style={[
                styles.statusValue,
                { color: status.verified ? "#10b981" : "#6b7280" },
              ]}
            >
              {status.verified ? "Verified" : "Pending"}
            </Text>
          </View>
        ))}
      </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  statusGrid: {
    gap: 10,
    marginTop: 12,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  statusCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  statusLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  statusValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AccountStatusSection;
