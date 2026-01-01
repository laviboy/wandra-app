import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

interface StepContainerProps {
  children: React.ReactNode;
  currentStep?: number;
}

export const StepContainer: React.FC<StepContainerProps> = ({
  children,
  currentStep,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to top when step changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentStep]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100, // Space for navigation buttons
  },
});
