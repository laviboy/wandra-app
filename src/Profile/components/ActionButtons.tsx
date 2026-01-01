import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonsProps {
  onSettingsPress: () => void;
  onLogoutPress: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSettingsPress,
  onLogoutPress,
}) => {
  return (
    <View style={styles.actionsSection}>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onSettingsPress}
      >
        <Text style={styles.secondaryButtonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    marginTop: 8,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  logoutButton: {
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#dc2626",
  },
});

export default ActionButtons;
