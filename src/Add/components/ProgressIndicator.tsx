import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles?: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles = [],
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        {stepTitles[currentStep - 1] && (
          <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>
        )}
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index + 1 === currentStep && styles.dotActive,
              index + 1 < currentStep && styles.dotCompleted,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  header: {
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e5e7eb",
  },
  dotActive: {
    backgroundColor: "#3b82f6",
    width: 24,
  },
  dotCompleted: {
    backgroundColor: "#10b981",
  },
});
