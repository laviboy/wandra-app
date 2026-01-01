import type { NavigatorScreenParams } from "@react-navigation/native";

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Tab Stacks
export type HomeStackParamList = {
  HomeMain: undefined;
  HomeDetail: { id: string };
};

export type SearchStackParamList = {
  SearchMain: undefined;
  SearchResults: { query: string };
  SearchDetail: { id: string };
};

export type AddStackParamList = {
  AddMain: undefined;
  AddForm: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
  AllListings: { listings: any[]; title: string };
  ProfileDetail: { id: string };
};

export type CreatorProfileStackParamList = {
  CreatorProfileMain: { userId: string };
  CreatorProfileDetail: { id: string };
  CreatorProfileAllListings: { listings: any[]; title: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  SettingsDetail: { section: string };
};

// Bottom Tabs
export type BottomTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SearchTab: NavigatorScreenParams<SearchStackParamList>;
  AddTab: NavigatorScreenParams<AddStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  CreatorProfileTab: NavigatorScreenParams<CreatorProfileStackParamList>;
  SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<BottomTabsParamList>;
};
