import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../Auth/hooks/useAuthStore";
import AuthStack from "../Auth/navigation/AuthStack";
import BottomTabs from "./BottomTabs";

const RootNavigator = () => {
  const { isAuthenticated, isLoading, isInitialized, initialize } =
    useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
