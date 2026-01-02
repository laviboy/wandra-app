import { Colors } from "@/constants/theme";
import { useAuth } from "@/src/Auth/hooks/useAuth";
import type { SettingsStackParamList } from "@/src/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SettingsSectionHeader } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "ProfileSettings">;

const ProfileSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phoneNumber: "",
    company: "",
    accountRole: "Creator",
    website: "",
    bio: "",
  });

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handlePhotoUpdate = () => {
    Alert.alert("Update Photo", "Photo picker will be implemented");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: colors.backgroundSecondary },
        ]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Profile Photo */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsSectionHeader title="Profile Photo" />
          <View style={styles.photoContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.backgroundTertiary },
              ]}
            >
              <Ionicons name="person" size={40} color={colors.icon} />
            </View>
            <TouchableOpacity
              style={[
                styles.changePhotoButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handlePhotoUpdate}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsSectionHeader title="Personal Information" />
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.fullName}
              onChangeText={(text) =>
                setFormData({ ...formData, fullName: text })
              }
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Phone Number
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.phoneNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, phoneNumber: text })
              }
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Company</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.company}
              onChangeText={(text) =>
                setFormData({ ...formData, company: text })
              }
              placeholder="Enter your company name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Account Role */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsSectionHeader title="Account Role" />
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Role</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.accountRole}
              onChangeText={(text) =>
                setFormData({ ...formData, accountRole: text })
              }
              placeholder="e.g., Creator, Traveler"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>

        {/* Website & Bio */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <SettingsSectionHeader title="Additional Information" />
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Website</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.website}
              onChangeText={(text) =>
                setFormData({ ...formData, website: text })
              }
              placeholder="https://yourwebsite.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: colors.backgroundSecondary,
                  color: colors.text,
                },
              ]}
              value={formData.bio}
              onChangeText={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.cancelButton,
              { backgroundColor: colors.backgroundTertiary },
            ]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  photoContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  changePhotoButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  formGroup: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {},
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileSettingsScreen;
