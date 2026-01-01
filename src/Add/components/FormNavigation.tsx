import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FormNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  onSaveDraft?: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  onNext,
  onBack,
  onSaveDraft,
  isFirstStep,
  isLastStep,
  isNextDisabled = false,
  isLoading = false,
  nextLabel,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        {!isFirstStep && (
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onBack}
            disabled={isLoading}
          >
            <Text style={styles.buttonSecondaryText}>Back</Text>
          </TouchableOpacity>
        )}

        {onSaveDraft && !isLastStep && (
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={onSaveDraft}
            disabled={isLoading}
          >
            <Text style={styles.buttonOutlineText}>Save Draft</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonPrimary,
            isFirstStep && styles.buttonFullWidth,
            isNextDisabled && styles.buttonDisabled,
          ]}
          onPress={onNext}
          disabled={isNextDisabled || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {nextLabel || (isLastStep ? "Publish Listing" : "Next")}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32, // Extra padding for iOS safe area
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
  },
  buttonPrimaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#f3f4f6",
  },
  buttonSecondaryText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonOutlineText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: "#d1d5db",
    opacity: 0.6,
  },
});
