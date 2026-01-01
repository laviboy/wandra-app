import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { HomeStackParamList } from "../../navigation/types";
import ListingCard from "../components/ListingCard";
import { useListings } from "../hooks/useListings";
import type { Listing } from "../types/listing";

type Props = NativeStackScreenProps<HomeStackParamList, "HomeMain">;

const HomeScreen = ({ navigation }: Props) => {
  const {
    data: listings,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useListings();

  const handleCardPress = useCallback(
    (listingId: string) => {
      navigation.navigate("HomeDetail", { id: listingId });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Listing }) => (
      <ListingCard listing={item} onPress={() => handleCardPress(item.id)} />
    ),
    [handleCardPress]
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🏝️</Text>
      <Text style={styles.emptyTitle}>No adventures yet</Text>
      <Text style={styles.emptyText}>
        Check back soon for exciting travel experiences!
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Discover Adventures</Text>
      <Text style={styles.headerSubtitle}>
        Find your next unforgettable experience
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading adventures...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Failed to load listings</Text>
        <Text style={styles.errorMessage}>
          {error instanceof Error ? error.message : "Please try again"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 24,
  },
  listContent: {
    paddingBottom: 16,
  },
  header: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "400",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#EF4444",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default HomeScreen;
