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
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SettingsSectionHeader } from "../components";

type Props = NativeStackScreenProps<SettingsStackParamList, "PaymentMethods">;

interface PaymentCard {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

const PaymentMethodsScreen: React.FC<Props> = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [cards] = useState<PaymentCard[]>([
    {
      id: "1",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
    },
    {
      id: "2",
      brand: "Mastercard",
      last4: "5555",
      expiryMonth: 8,
      expiryYear: 2025,
      isDefault: false,
    },
  ]);

  const [billingEmail, setBillingEmail] = useState("user@example.com");

  const handleAddCard = () => {
    Alert.alert("Add Card", "Card addition flow will be implemented");
  };

  const handleRemoveCard = (cardId: string) => {
    Alert.alert("Remove Card", "Are you sure you want to remove this card?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive" },
    ]);
  };

  const handleSave = () => {
    Alert.alert("Success", "Payment settings updated successfully");
  };

  const getCardIcon = (brand: string): keyof typeof Ionicons.glyphMap => {
    return "card-outline";
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.backgroundSecondary },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Saved Payment Methods */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Saved Payment Methods" />
        {cards.map((card) => (
          <View
            key={card.id}
            style={[styles.cardItem, { borderBottomColor: colors.border }]}
          >
            <View
              style={[
                styles.cardIconContainer,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Ionicons
                name={getCardIcon(card.brand)}
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardBrand, { color: colors.text }]}>
                {card.brand} •••• {card.last4}
              </Text>
              <Text
                style={[styles.cardExpiry, { color: colors.textSecondary }]}
              >
                Expires {card.expiryMonth}/{card.expiryYear}
              </Text>
              {card.isDefault && (
                <View
                  style={[
                    styles.defaultBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveCard(card.id)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: colors.backgroundSecondary },
          ]}
          onPress={handleAddCard}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>
            Add New Card
          </Text>
        </TouchableOpacity>
      </View>

      {/* Billing Information */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <SettingsSectionHeader title="Billing Information" />
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Billing Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
              },
            ]}
            value={billingEmail}
            onChangeText={setBillingEmail}
            placeholder="Enter billing email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Payment Settings</Text>
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
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 13,
  },
  defaultBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  defaultText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
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

export default PaymentMethodsScreen;
