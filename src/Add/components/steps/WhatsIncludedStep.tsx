import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IncludedItem, ListingFormData } from "../../types/listing";

interface WhatsIncludedStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

export const WhatsIncludedStep: React.FC<WhatsIncludedStepProps> = ({
  formData,
  updateFormData,
}) => {
  const addIncludedItem = () => {
    const newItem: IncludedItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    updateFormData({ included_items: [...formData.included_items, newItem] });
  };

  const updateIncludedItem = (id: string, updates: Partial<IncludedItem>) => {
    const items = formData.included_items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateFormData({ included_items: items });
  };

  const removeIncludedItem = (id: string) => {
    updateFormData({
      included_items: formData.included_items.filter((item) => item.id !== id),
    });
  };

  const addNotIncludedItem = () => {
    const newItem: IncludedItem = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };
    updateFormData({
      not_included_items: [...formData.not_included_items, newItem],
    });
  };

  const updateNotIncludedItem = (
    id: string,
    updates: Partial<IncludedItem>
  ) => {
    const items = formData.not_included_items.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    updateFormData({ not_included_items: items });
  };

  const removeNotIncludedItem = (id: string) => {
    updateFormData({
      not_included_items: formData.not_included_items.filter(
        (item) => item.id !== id
      ),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What&apos;s Included</Text>
          <TouchableOpacity style={styles.addButton} onPress={addIncludedItem}>
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {formData.included_items.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNumber}>Item {index + 1}</Text>
              <TouchableOpacity onPress={() => removeIncludedItem(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) =>
                updateIncludedItem(item.id, { title: text })
              }
              placeholder="e.g., All meals included"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) =>
                updateIncludedItem(item.id, { description: text })
              }
              placeholder="Brief description (optional)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={2}
            />
          </View>
        ))}

        {formData.included_items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items added yet</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>What&apos;s Not Included</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={addNotIncludedItem}
          >
            <Text style={styles.addButtonText}>+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {formData.not_included_items.map((item, index) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNumber}>Item {index + 1}</Text>
              <TouchableOpacity onPress={() => removeNotIncludedItem(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={item.title}
              onChangeText={(text) =>
                updateNotIncludedItem(item.id, { title: text })
              }
              placeholder="e.g., International flights"
              placeholderTextColor="#9ca3af"
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              value={item.description}
              onChangeText={(text) =>
                updateNotIncludedItem(item.id, { description: text })
              }
              placeholder="Brief description (optional)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={2}
            />
          </View>
        ))}

        {formData.not_included_items.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No items added yet</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.sectionTitle}>Cancellation Policy</Text>
        <TextInput
          style={[styles.input, styles.textArea, styles.textAreaLarge]}
          value={formData.cancellation_policy}
          onChangeText={(text) => updateFormData({ cancellation_policy: text })}
          placeholder="Describe your cancellation and refund policy..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={5}
        />
        <Text style={styles.helperText}>
          Be clear about refund terms and deadlines
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  removeButton: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
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
    minHeight: 60,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    minHeight: 100,
  },
  emptyState: {
    backgroundColor: "#f9fafb",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyStateText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  field: {
    gap: 8,
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
});
