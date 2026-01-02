import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ItineraryItem, ListingFormData } from "../../types/listing";
import { AutoScrollTextInput } from "../AutoScrollTextInput";

interface ItineraryStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

export const ItineraryStep: React.FC<ItineraryStepProps> = ({
  formData,
  updateFormData,
}) => {
  const addItineraryDay = () => {
    const newDay: ItineraryItem = {
      id: Date.now().toString(),
      day: formData.itinerary.length + 1,
      title: "",
      description: "",
    };
    updateFormData({ itinerary: [...formData.itinerary, newDay] });
  };

  const updateItineraryDay = (id: string, updates: Partial<ItineraryItem>) => {
    const items = formData.itinerary.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateFormData({ itinerary: items });
  };

  const removeItineraryDay = (id: string) => {
    const updatedItinerary = formData.itinerary
      .filter((item) => item.id !== id)
      .map((item, index) => ({ ...item, day: index + 1 }));
    updateFormData({ itinerary: updatedItinerary });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Daily Itinerary</Text>
        <Text style={styles.subtitle}>
          Add a day-by-day breakdown of your travel experience
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addItineraryDay}>
        <Text style={styles.addButtonText}>+ Add Day</Text>
      </TouchableOpacity>

      {formData.itinerary.map((item) => (
        <View key={item.id} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Day {item.day}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItineraryDay(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <AutoScrollTextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) =>
                updateItineraryDay(item.id, { title: text })
              }
              placeholder="e.g., Arrival and City Tour"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description *</Text>
            <AutoScrollTextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) =>
                updateItineraryDay(item.id, { description: text })
              }
              placeholder="Describe the activities for this day..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      ))}

      {formData.itinerary.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📅</Text>
          <Text style={styles.emptyStateTitle}>No itinerary added yet</Text>
          <Text style={styles.emptyStateText}>
            Add daily activities to help travelers know what to expect
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  dayBadgeText: {
    color: "#1e40af",
    fontWeight: "700",
    fontSize: 14,
  },
  removeButton: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  emptyState: {
    backgroundColor: "#f9fafb",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  emptyStateIcon: {
    fontSize: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
