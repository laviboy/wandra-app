import { useAuth } from "@/src/Auth/hooks/useAuth";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  userInfo: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
