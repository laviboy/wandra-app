import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddScreen from "../Add/screens/AddScreen";
import HomeScreen from "../Home/screens/HomeScreen";
import ListingDetailScreen from "../Home/screens/ListingDetailScreen";
import AllListingsScreen from "../Profile/screens/AllListingsScreen";
import ProfileScreen from "../Profile/screens/ProfileScreen";
import SearchScreen from "../Search/screens/SearchScreen";
import SettingsScreen from "../Settings/screens/SettingsScreen";
import type {
  AddStackParamList,
  BottomTabsParamList,
  HomeStackParamList,
  ProfileStackParamList,
  SearchStackParamList,
  SettingsStackParamList,
} from "./types";

// Create stack navigators for each tab
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const SearchStack = createNativeStackNavigator<SearchStackParamList>();
const AddStack = createNativeStackNavigator<AddStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

// Home Stack Navigator
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="HomeMain"
      component={HomeScreen}
      options={{ title: "Home" }}
    />
    <HomeStack.Screen
      name="HomeDetail"
      component={ListingDetailScreen}
      options={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
        fullScreenGestureEnabled: true,
      }}
    />
  </HomeStack.Navigator>
);

// Search Stack Navigator
const SearchStackNavigator = () => (
  <SearchStack.Navigator>
    <SearchStack.Screen
      name="SearchMain"
      component={SearchScreen}
      options={{ title: "Search" }}
    />
    <SearchStack.Screen
      name="SearchDetail"
      component={ListingDetailScreen}
      options={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
        fullScreenGestureEnabled: true,
      }}
    />
  </SearchStack.Navigator>
);

// Add Stack Navigator
const AddStackNavigator = () => (
  <AddStack.Navigator>
    <AddStack.Screen
      name="AddMain"
      component={AddScreen}
      options={{ title: "Add" }}
    />
  </AddStack.Navigator>
);

// Profile Stack Navigator
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: "Profile" }}
    />
    <ProfileStack.Screen
      name="AllListings"
      component={AllListingsScreen}
      options={{
        headerShown: true,
        presentation: "card",
        animation: "slide_from_right",
      }}
    />
    <ProfileStack.Screen
      name="ProfileDetail"
      component={ListingDetailScreen}
      options={{
        headerShown: false,
        presentation: "card",
        animation: "slide_from_right",
        fullScreenGestureEnabled: true,
      }}
    />
  </ProfileStack.Navigator>
);

// Settings Stack Navigator
const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="SettingsMain"
      component={SettingsScreen}
      options={{ title: "Settings" }}
    />
  </SettingsStack.Navigator>
);

// Bottom Tabs
const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={AddStackNavigator}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
