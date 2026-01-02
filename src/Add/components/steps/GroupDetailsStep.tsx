import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DifficultyLevel, ListingFormData } from "../../types/listing";
import { AutoScrollTextInput } from "../AutoScrollTextInput";

interface GroupDetailsStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
}

const DIFFICULTY_LEVELS: {
  value: DifficultyLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Light activity, suitable for most people",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "Some physical activity required",
  },
  {
    value: "challenging",
    label: "Challenging",
    description: "High physical demands",
  },
];

export const GroupDetailsStep: React.FC<GroupDetailsStepProps> = ({
  formData,
  updateFormData,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Max Group Size *</Text>
        <AutoScrollTextInput
          style={styles.input}
          value={formData.max_group_size.toString()}
          onChangeText={(text) => {
            const num = text === "" ? 0 : parseInt(text);
            if (!isNaN(num)) {
              updateFormData({ max_group_size: num });
            }
          }}
          placeholder="12"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>
          Maximum number of travelers for this experience
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Available Spots *</Text>
        <AutoScrollTextInput
          style={styles.input}
          value={formData.available_spots.toString()}
          onChangeText={(text) => {
            const num = text === "" ? 0 : parseInt(text);
            if (!isNaN(num)) {
              updateFormData({ available_spots: num });
            }
          }}
          placeholder="10"
          placeholderTextColor="#9ca3af"
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>
          Current number of spots available for booking
        </Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Age Range</Text>

      <View style={styles.ageRow}>
        <View style={[styles.field, styles.ageField]}>
          <Text style={styles.label}>Min Age *</Text>
          <AutoScrollTextInput
            style={styles.input}
            value={formData.age_range_min.toString()}
            onChangeText={(text) => {
              const num = text === "" ? 0 : parseInt(text);
              if (!isNaN(num)) {
                updateFormData({ age_range_min: num });
              }
            }}
            placeholder="18"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.field, styles.ageField]}>
          <Text style={styles.label}>Max Age *</Text>
          <AutoScrollTextInput
            style={styles.input}
            value={formData.age_range_max.toString()}
            onChangeText={(text) => {
              const num = text === "" ? 0 : parseInt(text);
              if (!isNaN(num)) {
                updateFormData({ age_range_max: num });
              }
            }}
            placeholder="65"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.field}>
        <Text style={styles.sectionTitle}>Activity Level *</Text>
        <Text style={styles.helperText}>
          Select the physical difficulty of this travel experience
        </Text>

        <View style={styles.difficultyContainer}>
          {DIFFICULTY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.difficultyCard,
                formData.difficulty === level.value &&
                  styles.difficultyCardActive,
              ]}
              onPress={() => updateFormData({ difficulty: level.value })}
            >
              <View style={styles.difficultyHeader}>
                <View
                  style={[
                    styles.difficultyRadio,
                    formData.difficulty === level.value &&
                      styles.difficultyRadioActive,
                  ]}
                >
                  {formData.difficulty === level.value && (
                    <View style={styles.difficultyRadioInner} />
                  )}
                </View>
                <Text
                  style={[
                    styles.difficultyLabel,
                    formData.difficulty === level.value &&
                      styles.difficultyLabelActive,
                  ]}
                >
                  {level.label}
                </Text>
              </View>
              <Text style={styles.difficultyDescription}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
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
  helperText: {
    fontSize: 12,
    color: "#6b7280",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  ageRow: {
    flexDirection: "row",
    gap: 12,
  },
  ageField: {
    flex: 1,
  },
  difficultyContainer: {
    gap: 12,
    marginTop: 8,
  },
  difficultyCard: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  difficultyCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  difficultyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  difficultyRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyRadioActive: {
    borderColor: "#3b82f6",
  },
  difficultyRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3b82f6",
  },
  difficultyLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  difficultyLabelActive: {
    color: "#1e40af",
  },
  difficultyDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 36,
  },
});
