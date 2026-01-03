import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../utils/supabase";

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  milestoneId: number; // 1=deposit, 2=second, 3=final
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  milestoneId,
  onSuccess,
  onCancel,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const match = v.match(/\d{4,16}/g);
    const matchValue = (match && match[0]) || "";
    const parts = [];

    for (let i = 0; i < matchValue.length; i += 4) {
      parts.push(matchValue.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.replace(/\s/g, "").length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (text: string) => {
    const value = text.replace(/\//g, "");
    if (value.length <= 4) {
      setExpiryDate(formatExpiryDate(value));
    }
  };

  const handleCvvChange = (text: string) => {
    const value = text.replace(/[^0-9]/g, "");
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      const cleanCardNumber = cardNumber.replace(/\s/g, "");

      // Test card logic
      const isSuccess = cleanCardNumber === "4242424242424242";

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      if (isSuccess) {
        // Determine payment_status based on milestone
        let paymentStatus = "pending";
        let bookingStatus = "pending_payment";
        let depositPaid = false;

        if (milestoneId === 1) {
          // First payment (20%)
          paymentStatus = "deposit_paid";
          bookingStatus = "accepted";
          depositPaid = true;
        } else if (milestoneId === 2) {
          // Second payment (30%)
          paymentStatus = "partial_paid";
          bookingStatus = "accepted";
          depositPaid = true;
        } else if (milestoneId === 3) {
          // Final payment (50%)
          paymentStatus = "completed";
          bookingStatus = "confirmed";
          depositPaid = true;
        }

        // Update booking payment status in database
        const { error } = await supabase
          .from("travel_group_bookings")
          .update({
            deposit_paid: depositPaid,
            payment_status: paymentStatus,
            status: bookingStatus,
            ...(milestoneId === 3 && {
              confirmed_at: new Date().toISOString(),
            }),
          })
          .eq("id", bookingId);

        if (error) throw error;

        const paymentMessages = {
          1: "Your deposit has been processed successfully.",
          2: "Your second payment has been processed successfully.",
          3: "Your final payment has been processed successfully. Your booking is now confirmed!",
        };

        Alert.alert(
          "Payment Successful!",
          paymentMessages[milestoneId as keyof typeof paymentMessages] ||
            "Payment processed successfully.",
          [{ text: "OK", onPress: onSuccess }]
        );
      } else {
        Alert.alert(
          "Payment Failed",
          "The card was declined. Please use test card 4242 4242 4242 4242 or try another card."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Error",
        "An error occurred while processing your payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return `RM ${value.toFixed(2)}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="card" size={24} color="#EF4444" />
              <Text style={styles.headerTitle}>
                {milestoneId === 1
                  ? "Pay Deposit"
                  : milestoneId === 2
                    ? "Pay Second Installment"
                    : "Pay Final Installment"}
              </Text>
            </View>
            <Text style={styles.headerSubtitle}>
              Secure your spot by paying the deposit
            </Text>
          </View>

          {/* Amount Display */}
          <View style={styles.amountDisplay}>
            <Text style={styles.amountLabel}>Deposit Amount</Text>
            <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
          </View>

          {/* Test Card Info */}
          <View style={styles.testCardInfo}>
            <Text style={styles.testCardTitle}>🧪 Test Mode</Text>
            <Text style={styles.testCardText}>
              Use <Text style={styles.testCardCode}>4242 4242 4242 4242</Text>{" "}
              for success
            </Text>
            <Text style={styles.testCardText}>
              Use <Text style={styles.testCardCode}>4000 0000 0000 0002</Text>{" "}
              for failure
            </Text>
          </View>

          {/* Card Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="card-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
                editable={!isProcessing}
              />
            </View>
          </View>

          {/* Cardholder Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="words"
              editable={!isProcessing}
            />
          </View>

          {/* Expiry and CVV */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expiryDate}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
                editable={!isProcessing}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                value={cvv}
                onChangeText={handleCvvChange}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                editable={!isProcessing}
              />
            </View>
          </View>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <Ionicons name="lock-closed" size={16} color="#6B7280" />
            <Text style={styles.securityText}>
              Your payment information is secure
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isProcessing}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                isProcessing && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View style={styles.processingRow}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.submitButtonText}>Processing...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>
                  Pay {formatCurrency(amount)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 20,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  amountDisplay: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  },
  testCardInfo: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  testCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 6,
  },
  testCardText: {
    fontSize: 12,
    color: "#1E40AF",
    marginBottom: 2,
  },
  testCardCode: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: "#6B7280",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  submitButton: {
    backgroundColor: "#EF4444",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default PaymentForm;
