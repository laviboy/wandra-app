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

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoginPending } = useAuth();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    login(
      { email, password },
      {
        onError: (error) => {
          Alert.alert("Login Failed", error.message);
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
            Welcome Back
          </Text>
          <Text style={{ fontSize: 16, color: "#666" }}>
            Sign in to continue
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
              editable={!isLoginPending}
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoginPending}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isLoginPending ? "#ccc" : "#007AFF",
            padding: 16,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={handleLogin}
          disabled={isLoginPending}
        >
          {isLoginPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
              Login
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
            Don&apos;t have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            disabled={isLoginPending}
          >
            <Text style={{ color: "#007AFF", fontSize: 14, fontWeight: "600" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
