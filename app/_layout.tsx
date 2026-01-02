import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import RootNavigator from "../src/navigation/RootNavigator";

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </QueryClientProvider>
  );
}
