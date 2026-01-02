import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ListingFormData } from "../../types/listing";
import { AutoScrollTextInput } from "../AutoScrollTextInput";

interface DatesPricingStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const CURRENCIES = ["MYR", "USD", "SGD"];

export const DatesPricingStep: React.FC<DatesPricingStepProps> = ({
  formData,
  updateFormData,
}) => {
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);
  const calculateDuration = () => {
    if (formData.start_date && formData.end_date) {
      const diff = formData.end_date.getTime() - formData.start_date.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "";
    }
    return "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Start Date *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.start_date
              ? formData.start_date.toLocaleDateString()
              : "Select start date"}
          </Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={formData.start_date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartPicker(Platform.OS === "ios");
              if (selectedDate) {
                updateFormData({ start_date: selectedDate });
              }
            }}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>End Date *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.end_date
              ? formData.end_date.toLocaleDateString()
              : "Select end date"}
          </Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={formData.end_date || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndPicker(Platform.OS === "ios");
              if (selectedDate) {
                updateFormData({ end_date: selectedDate });
              }
            }}
            minimumDate={formData.start_date || new Date()}
          />
        )}
      </View>

      {calculateDuration() && (
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>
            Duration: {calculateDuration()}
          </Text>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.label}>Currency *</Text>
        <View style={styles.currencyContainer}>
          {CURRENCIES.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                formData.currency === currency && styles.currencyButtonActive,
              ]}
              onPress={() => updateFormData({ currency })}
            >
              <Text
                style={[
                  styles.currencyButtonText,
                  formData.currency === currency &&
                    styles.currencyButtonTextActive,
                ]}
              >
                {currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.priceRow}>
        <View style={[styles.field, styles.priceField]}>
          <Text style={styles.label}>Min Price *</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>{formData.currency}</Text>
            <AutoScrollTextInput
              style={styles.priceInput}
              value={formData.price_min?.toString() || ""}
              onChangeText={(text) => {
                const num = parseInt(text) || null;
                updateFormData({ price_min: num });
              }}
              placeholder="500"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={[styles.field, styles.priceField]}>
          <Text style={styles.label}>Max Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>{formData.currency}</Text>
            <AutoScrollTextInput
              style={styles.priceInput}
              value={formData.price_max?.toString() || ""}
              onChangeText={(text) => {
                const num = parseInt(text) || null;
                updateFormData({ price_max: num });
              }}
              placeholder="1500"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <Text style={styles.helperText}>
        Set a price range for your travel package. Min price is required.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  durationBadge: {
    backgroundColor: "#dbeafe",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  durationText: {
    color: "#1e40af",
    fontWeight: "600",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  currencyContainer: {
    flexDirection: "row",
    gap: 8,
  },
  currencyButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  currencyButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  currencyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  currencyButtonTextActive: {
    color: "#fff",
  },
  priceRow: {
    flexDirection: "row",
    gap: 12,
  },
  priceField: {
    flex: 1,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingLeft: 12,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
});
