import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { useAuthStore } from "../Auth/hooks/useAuthStore";
import AuthStack from "../Auth/navigation/AuthStack";
import BottomTabs from "./BottomTabs";

const RootNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      {isAuthenticated ? <BottomTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
