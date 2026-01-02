import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ListingFormData } from "../../types/listing";
import { AutoScrollTextInput } from "../AutoScrollTextInput";

const POPULAR_TAGS = [
  "adventure",
  "cultural",
  "wellness",
  "beach",
  "mountain",
  "city",
  "food",
  "photography",
  "wildlife",
  "luxury",
  "budget",
  "family",
  "solo",
  "couples",
  "groups",
];

interface BasicInfoStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
}) => {
  const toggleTag = (tag: string) => {
    if (formData.tags.includes(tag)) {
      updateFormData({
        tags: formData.tags.filter((t: string) => t !== tag),
      });
    } else {
      updateFormData({ tags: [...formData.tags, tag] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Travel Title *</Text>
        <AutoScrollTextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(text) => updateFormData({ title: text })}
          placeholder="e.g., Amazing Safari Adventure in Kenya"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Destination *</Text>
        <AutoScrollTextInput
          style={styles.input}
          value={formData.destination}
          onChangeText={(text) => updateFormData({ destination: text })}
          placeholder="e.g., Masai Mara, Kenya"
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Short Description *</Text>
        <AutoScrollTextInput
          style={[styles.input, styles.textArea]}
          value={formData.short_description}
          onChangeText={(text) => updateFormData({ short_description: text })}
          placeholder="Brief summary (max 150 characters)"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
          maxLength={150}
        />
        <Text style={styles.charCount}>
          {formData.short_description.length}/150
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Full Description *</Text>
        <AutoScrollTextInput
          style={[styles.input, styles.textArea, styles.textAreaLarge]}
          value={formData.description}
          onChangeText={(text) => updateFormData({ description: text })}
          placeholder="Detailed description of your travel experience..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tags</Text>
        <Text style={styles.helperText}>
          Select tags that describe your travel experience
        </Text>

        <View style={styles.tagsContainer}>
          {POPULAR_TAGS.map((tag) => {
            const isSelected = formData.tags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tagChip, isSelected && styles.tagChipSelected]}
                onPress={() => toggleTag(tag)}
              >
                <Text
                  style={[
                    styles.tagChipText,
                    isSelected && styles.tagChipTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "right",
  },
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tagChipSelected: {
    backgroundColor: "#dbeafe",
    borderColor: "#3b82f6",
  },
  tagChipText: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  tagChipTextSelected: {
    color: "#1e40af",
  },
});
