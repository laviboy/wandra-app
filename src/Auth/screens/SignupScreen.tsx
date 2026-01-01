import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { AuthStackParamList } from "../../navigation/types";
import { useAuth } from "../hooks/useAuth";

type Props = NativeStackScreenProps<AuthStackParamList, "Signup">;

const SignupScreen = ({ navigation }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isSignupPending } = useAuth();

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    signup(
      { name, email, password },
      {
        onError: (error) => {
          Alert.alert("Signup Failed", error.message);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View style={{ marginBottom: 48 }}>
          <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8 }}>
            Create Account
          </Text>
          <Text style={{ fontSize: 16, color: "#666" }}>
            Sign up to get started
          </Text>
        </View>

        <View style={{ gap: 16, marginBottom: 24 }}>
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              editable={!isSignupPending}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Email
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSignupPending}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
                color: "#333",
              }}
            >
              Password
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isSignupPending}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isSignupPending ? "#ccc" : "#007AFF",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={handleSignup}
          disabled={isSignupPending}
        >
          {isSignupPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Sign Up
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#666", fontSize: 14 }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            disabled={isSignupPending}
          >
            <Text style={{ color: "#007AFF", fontSize: 14, fontWeight: "600" }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
