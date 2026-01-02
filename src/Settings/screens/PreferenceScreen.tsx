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

type Props = NativeStackScreenProps<SettingsStackParamList, "Preference">;

const PreferenceScreen: React.FC<Props> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [preferences, setPreferences] = useState({
    language: "English",
    timezone: "Pacific Time (PT)",
    currency: "USD",
    showProfileToPublic: true,
    showEmailAddress: false,
  });

  const handleSave = () => {
    Alert.alert("Success", "Preferences updated successfully");
  };

  const handleLanguageSelect = () => {
    Alert.alert("Select Language", "Language picker will be implemented");
  };

  const handleTimezoneSelect = () => {
    Alert.alert("Select Timezone", "Timezone picker will be implemented");
  };

  const handleCurrencySelect = () => {
    Alert.alert("Select Currency", "Currency picker will be implemented");
  };

  const handleToggle = (key: "showProfileToPublic" | "showEmailAddress") => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const SelectItem = ({
    title,
    value,
    onPress,
  }: {
    title: string;
    value: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.selectItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.selectContent}>
        <Text style={[styles.selectTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.selectValue, { color: colors.primary }]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const ToggleItem = ({
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
    <View style={[styles.toggleItem, { borderBottomColor: colors.border }]}>
      <View style={styles.toggleContent}>
        <Text style={[styles.toggleTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.toggleSubtitle, { color: colors.textSecondary }]}>
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
      {/* Regional Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Regional Settings" />
        <SelectItem
          title="Language"
          value={preferences.language}
          onPress={handleLanguageSelect}
        />
        <SelectItem
          title="Timezone"
          value={preferences.timezone}
          onPress={handleTimezoneSelect}
        />
        <SelectItem
          title="Currency"
          value={preferences.currency}
          onPress={handleCurrencySelect}
        />
      </View>

      {/* Privacy Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Privacy Settings" />
        <ToggleItem
          title="Show Profile to Public"
          subtitle="Make your profile visible to other users"
          value={preferences.showProfileToPublic}
          onToggle={() => handleToggle("showProfileToPublic")}
        />
        <ToggleItem
          title="Show Email Address"
          subtitle="Display your email on your public profile"
          value={preferences.showEmailAddress}
          onToggle={() => handleToggle("showEmailAddress")}
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
  selectItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selectContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  selectValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleContent: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  toggleSubtitle: {
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

export default PreferenceScreen;
