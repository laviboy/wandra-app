import { Colors } from "@/constants/theme";
import type { SettingsStackParamList } from "@/src/navigation/types";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import { SettingsListItem } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "SettingsMain">;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const settingsCategories = [
    {
      icon: "person-outline" as const,
      title: "Profile",
      subtitle: "Update your personal details and public profile",
      onPress: () => navigation.navigate("ProfileSettings"),
    },
    {
      icon: "card-outline" as const,
      title: "Payment Methods",
      subtitle: "Manage your payment options and billing information",
      onPress: () => navigation.navigate("PaymentMethods"),
    },
    {
      icon: "location-outline" as const,
      title: "Address",
      subtitle: "Manage your shipping and billing addresses",
      onPress: () => navigation.navigate("Address"),
    },
    {
      icon: "notifications-outline" as const,
      title: "Notifications",
      subtitle: "Control your notification preferences",
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: "shield-checkmark-outline" as const,
      title: "Security",
      subtitle: "Manage password and two-factor authentication",
      onPress: () => navigation.navigate("Security"),
    },
    {
      icon: "settings-outline" as const,
      title: "Preference",
      subtitle: "Customize your app experience",
      onPress: () => navigation.navigate("Preference"),
    },
  ];

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {settingsCategories.map((category, index) => (
        <SettingsListItem
          key={index}
          icon={category.icon}
          title={category.title}
          subtitle={category.subtitle}
          onPress={category.onPress}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
  },
});

export default SettingsScreen;
