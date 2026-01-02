import { Colors } from "@/constants/theme";
import type { SettingsStackParamList } from "@/src/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SettingsSectionHeader } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "Security">;

const SecurityScreen: React.FC<Props> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    Alert.alert("Success", "Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      Alert.alert(
        "Enable Two-Factor Authentication",
        "This will add an extra layer of security to your account. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Enable",
            onPress: () => {
              setTwoFactorEnabled(true);
              Alert.alert("Success", "Two-factor authentication enabled");
            },
          },
        ]
      );
    } else {
      setTwoFactorEnabled(false);
      Alert.alert("Success", "Two-factor authentication disabled");
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Change Password */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Change Password" />
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Current Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            New Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Confirm New Password
          </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPasswords}
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPasswords(!showPasswords)}
        >
          <Ionicons
            name={showPasswords ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.showPasswordText, { color: colors.primary }]}>
            {showPasswords ? "Hide" : "Show"} Passwords
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.changePasswordButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Two-Factor Authentication */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Two-Factor Authentication" />
        <View
          style={[styles.twoFactorItem, { borderBottomColor: colors.border }]}
        >
          <View style={styles.twoFactorContent}>
            <View style={styles.twoFactorHeader}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.twoFactorTitle, { color: colors.text }]}>
                Two-Factor Authentication
              </Text>
            </View>
            <Text
              style={[
                styles.twoFactorSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Add an extra layer of security to your account by requiring a
              verification code in addition to your password
            </Text>
            {twoFactorEnabled && (
              <View
                style={[
                  styles.enabledBadge,
                  { backgroundColor: colors.success },
                ]}
              >
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={styles.enabledText}>Enabled</Text>
              </View>
            )}
          </View>
          <Switch
            value={twoFactorEnabled}
            onValueChange={handleToggle2FA}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </View>
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
  formGroup: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  passwordContainer: {
    position: "relative",
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  showPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 16,
    gap: 6,
  },
  showPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  changePasswordButton: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  twoFactorItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  twoFactorContent: {
    flex: 1,
    marginRight: 12,
  },
  twoFactorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  twoFactorTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  twoFactorSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  enabledBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
    gap: 4,
  },
  enabledText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default SecurityScreen;
