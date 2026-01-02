import { Colors } from "@/constants/theme";
import type { SettingsStackParamList } from "@/src/navigation/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SettingsSectionHeader } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "Notifications">;

const NotificationsScreen: React.FC<Props> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    tripReminders: true,
    groupUpdates: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    Alert.alert("Success", "Notification preferences updated successfully");
  };

  const NotificationItem = ({
    title,
    subtitle,
    value,
    onToggle,
  }: {
    title: string;
    subtitle: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View
      style={[styles.notificationItem, { borderBottomColor: colors.border }]}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text
          style={[styles.notificationSubtitle, { color: colors.textSecondary }]}
        >
          {subtitle}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Communication Preferences */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Communication Channels" />
        <NotificationItem
          title="Email Notifications"
          subtitle="Receive notifications via email"
          value={notifications.emailNotifications}
          onToggle={() => handleToggle("emailNotifications")}
        />
        <NotificationItem
          title="Push Notifications"
          subtitle="Receive push notifications on your device"
          value={notifications.pushNotifications}
          onToggle={() => handleToggle("pushNotifications")}
        />
        <NotificationItem
          title="SMS Notifications"
          subtitle="Receive text messages for important updates"
          value={notifications.smsNotifications}
          onToggle={() => handleToggle("smsNotifications")}
        />
      </View>

      {/* Content Preferences */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="What You'll Receive" />
        <NotificationItem
          title="Marketing Emails"
          subtitle="Promotions, tips, and special offers"
          value={notifications.marketingEmails}
          onToggle={() => handleToggle("marketingEmails")}
        />
        <NotificationItem
          title="Trip Reminders"
          subtitle="Reminders about your upcoming trips"
          value={notifications.tripReminders}
          onToggle={() => handleToggle("tripReminders")}
        />
        <NotificationItem
          title="Group Updates"
          subtitle="Updates about your groups and bookings"
          value={notifications.groupUpdates}
          onToggle={() => handleToggle("groupUpdates")}
        />
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 13,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default NotificationsScreen;
