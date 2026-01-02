import { Colors } from "@/constants/theme";
import type { SettingsStackParamList } from "@/src/navigation/types";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SettingsSectionHeader } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "Address">;

interface Address {
  id: string;
  type: "shipping" | "billing";
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressScreen: React.FC<Props> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [addresses] = useState<Address[]>([
    {
      id: "1",
      type: "shipping",
      fullName: "John Doe",
      addressLine1: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
      isDefault: true,
    },
    {
      id: "2",
      type: "billing",
      fullName: "John Doe",
      addressLine1: "456 Market Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
      isDefault: false,
    },
  ]);

  const handleAddAddress = () => {
    Alert.alert("Add Address", "Address form will be implemented");
  };

  const handleEditAddress = (addressId: string) => {
    Alert.alert("Edit Address", "Edit address form will be implemented");
  };

  const handleRemoveAddress = (addressId: string) => {
    Alert.alert(
      "Remove Address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive" },
      ]
    );
  };

  const renderAddress = (address: Address) => (
    <View
      key={address.id}
      style={[
        styles.addressCard,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeContainer}>
          <Ionicons
            name={
              address.type === "shipping" ? "location-outline" : "card-outline"
            }
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.addressType, { color: colors.text }]}>
            {address.type === "shipping"
              ? "Shipping Address"
              : "Billing Address"}
          </Text>
        </View>
        {address.isDefault && (
          <View
            style={[styles.defaultBadge, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      <Text style={[styles.addressName, { color: colors.text }]}>
        {address.fullName}
      </Text>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.addressLine1}
      </Text>
      {address.addressLine2 && (
        <Text style={[styles.addressText, { color: colors.textSecondary }]}>
          {address.addressLine2}
        </Text>
      )}
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.city}, {address.state} {address.zipCode}
      </Text>
      <Text style={[styles.addressText, { color: colors.textSecondary }]}>
        {address.country}
      </Text>
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(address.id)}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemoveAddress(address.id)}
        >
          <Ionicons name="trash-outline" size={18} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>
            Remove
          </Text>
        </TouchableOpacity>
      </View>
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
      {/* Addresses List */}
      <View style={styles.section}>
        <SettingsSectionHeader title="Your Addresses" />
        <View style={styles.addressesContainer}>
          {addresses.map(renderAddress)}
        </View>
      </View>

      {/* Add Address Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddAddress}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add New Address</Text>
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
  addressesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  addressCard: {
    padding: 16,
    borderRadius: 12,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "600",
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2,
  },
  addressActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddressScreen;
