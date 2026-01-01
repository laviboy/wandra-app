import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../Auth/hooks/useAuthStore";
import AuthStack from "../Auth/navigation/AuthStack";
import ListingDetailScreen from "../Home/screens/ListingDetailScreen";
import AllListingsScreen from "../Profile/screens/AllListingsScreen";
import CreatorProfileScreen from "../Profile/screens/CreatorProfileScreen";
import BottomTabs from "./BottomTabs";
import type { CreatorProfileStackParamList } from "./types";

const RootStack = createNativeStackNavigator();
const CreatorProfileStack =
  createNativeStackNavigator<CreatorProfileStackParamList>();

// Creator Profile Modal Stack
const CreatorProfileModalStack = () => (
  <CreatorProfileStack.Navigator>
    <CreatorProfileStack.Screen
      name="CreatorProfileMain"
      component={CreatorProfileScreen}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 12 }}
          >
            <Ionicons name="close" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
      })}
    />
    <CreatorProfileStack.Screen
      name="CreatorProfileDetail"
      component={ListingDetailScreen as any}
      options={{
        headerShown: false,
        presentation: "card",
      }}
    />
    <CreatorProfileStack.Screen
      name="CreatorProfileAllListings"
      component={AllListingsScreen as any}
      options={{
        headerShown: true,
        presentation: "card",
        animation: "slide_from_right",
      }}
    />
  </CreatorProfileStack.Navigator>
);

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
      {isAuthenticated ? (
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen
              name="App"
              component={BottomTabs as any}
              options={{ headerShown: false }}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{ presentation: "modal" }}>
            <RootStack.Screen
              name="CreatorProfileModal"
              component={CreatorProfileModalStack as any}
              options={{
                headerShown: false,
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
