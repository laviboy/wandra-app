import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddScreen from "../Add/screens/AddScreen";
import HomeScreen from "../Home/screens/HomeScreen";
import ListingDetailScreen from "../Home/screens/ListingDetailScreen";
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
      options={{ title: "Listing Details" }}
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
          tabBarIcon: () => null, // You can add icons here
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStackNavigator}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="AddTab"
        component={AddStackNavigator}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
