import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSearchListings } from "../../Home/hooks/useListings";
import type { Listing } from "../../Home/types/listing";
import type { SearchStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<SearchStackParamList, "SearchMain">;

type SortOption = "popular" | "price-low" | "price-high" | "newest" | "rating";
type DifficultyFilter = "all" | "easy" | "moderate" | "hard";

const { width: screenWidth } = Dimensions.get("window");
const GRID_COLUMNS = 2;
const CARD_WIDTH = (screenWidth - 32) / GRID_COLUMNS;

// Memoized grid card component outside of SearchScreen
const GridCard = React.memo(
  ({
    listing,
    onPress,
  }: {
    listing: Listing;
    onPress: (id: string) => void;
  }) => {
    const imageUrl =
      listing.images && listing.images.length > 0
        ? listing.images[0].url
        : "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&auto=format&fit=crop&q=60";

    const priceDisplay =
      listing.price_min && listing.price_max
        ? listing.price_min === listing.price_max
          ? `${listing.currency} ${listing.price_min}`
          : `${listing.currency} ${listing.price_min}`
        : listing.price_min
          ? `${listing.currency} ${listing.price_min}`
          : "TBA";

    return (
      <TouchableOpacity
        style={styles.gridCard}
        onPress={() => onPress(listing.id)}
        activeOpacity={0.85}
      >
        {/* Image */}
        <View style={styles.gridImageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.gridImage}
            resizeMode="cover"
          />
          {listing.difficulty && (
            <View style={styles.gridDifficultyBadge}>
              <Text style={styles.gridDifficultyText}>
                {listing.difficulty.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {listing.rating !== null && listing.rating > 0 && (
            <View style={styles.gridRatingBadge}>
              <Text style={styles.gridRatingText}>
                ⭐ {listing.rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.gridContent}>
          <Text style={styles.gridTitle} numberOfLines={2}>
            {listing.title}
          </Text>
          <View style={styles.gridLocationRow}>
            <Text style={styles.gridLocationIcon}>📍</Text>
            <Text style={styles.gridLocation} numberOfLines={1}>
              {listing.destination}
            </Text>
          </View>
          <Text style={styles.gridPrice}>{priceDisplay}</Text>
        </View>
      </TouchableOpacity>
    );
  }
);

GridCard.displayName = "GridCard";

// Memoized search header component
const SearchHeader = React.memo(
  ({
    searchQuery,
    onSearchChange,
    filteredListingsCount,
    showFilters,
    setShowFilters,
    showSortMenu,
    setShowSortMenu,
    difficultyFilter,
    setDifficultyFilter,
    priceRange,
    setPriceRange,
    debouncedQuery,
  }: {
    searchQuery: string;
    onSearchChange: (text: string) => void;
    filteredListingsCount: number;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    showSortMenu: boolean;
    setShowSortMenu: (show: boolean) => void;
    difficultyFilter: DifficultyFilter;
    setDifficultyFilter: (filter: DifficultyFilter) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    debouncedQuery: string;
  }) => (
    <View style={styles.searchSection}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#9ca3af"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or location..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter and Sort Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options" size={18} color="#007AFF" />
          <Text style={styles.controlButtonText}>Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowSortMenu(true)}
        >
          <Ionicons name="swap-vertical" size={18} color="#007AFF" />
          <Text style={styles.controlButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {(debouncedQuery ||
        difficultyFilter !== "all" ||
        priceRange[1] < 10000) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersLabel}>Filters applied:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activeFiltersList}
          >
            {difficultyFilter !== "all" && (
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>{difficultyFilter}</Text>
                <TouchableOpacity onPress={() => setDifficultyFilter("all")}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {priceRange[1] < 10000 && (
              <View style={styles.filterTag}>
                <Text style={styles.filterTagText}>
                  ${priceRange[0]} - ${priceRange[1]}
                </Text>
                <TouchableOpacity onPress={() => setPriceRange([0, 10000])}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredListingsCount}{" "}
          {filteredListingsCount === 1 ? "result" : "results"} found
        </Text>
      </View>
    </View>
  )
);

SearchHeader.displayName = "SearchHeader";

const SearchScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search query
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [searchQuery]);

  const {
    data: allListings,
    isLoading,
    refetch,
    isRefetching,
  } = useSearchListings();

  // Filter and search listings
  const filteredListings = useMemo(() => {
    if (!allListings) return [];

    let results = allListings.filter((listing) => {
      // Search filter
      const searchLower = debouncedQuery.toLowerCase();
      const matchesSearch =
        listing.title.toLowerCase().includes(searchLower) ||
        listing.destination.toLowerCase().includes(searchLower) ||
        (listing.short_description?.toLowerCase().includes(searchLower) ??
          false);

      // Difficulty filter
      const matchesDifficulty =
        difficultyFilter === "all" || listing.difficulty === difficultyFilter;

      // Price range filter
      const minPrice = listing.price_min || 0;
      const matchesPrice =
        minPrice >= priceRange[0] && minPrice <= priceRange[1];

      return matchesSearch && matchesDifficulty && matchesPrice;
    });

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price_min || 0) - (b.price_min || 0);
        case "price-high":
          return (b.price_min || 0) - (a.price_min || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return (
            new Date(b.created_at || "").getTime() -
            new Date(a.created_at || "").getTime()
          );
        case "popular":
        default:
          return (b.review_count || 0) - (a.review_count || 0);
      }
    });

    return results;
  }, [allListings, debouncedQuery, difficultyFilter, priceRange, sortBy]);

  const handleCardPress = useCallback(
    (listingId: string) => {
      navigation.navigate("SearchDetail", { id: listingId });
    },
    [navigation]
  );

  const renderGridCard = useCallback(
    ({ item }: { item: Listing }) => (
      <GridCard listing={item} onPress={handleCardPress} />
    ),
    [handleCardPress]
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No results found</Text>
        <Text style={styles.emptyText}>
          Try adjusting your search or filters
        </Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Listing) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading adventures...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Header - Outside FlatList to prevent re-renders */}
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filteredListingsCount={filteredListings.length}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showSortMenu={showSortMenu}
        setShowSortMenu={setShowSortMenu}
        difficultyFilter={difficultyFilter}
        setDifficultyFilter={setDifficultyFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        debouncedQuery={debouncedQuery}
      />

      <FlatList
        data={filteredListings}
        renderItem={renderGridCard}
        keyExtractor={keyExtractor}
        numColumns={GRID_COLUMNS}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={10}
      />

      {/* Filters Modal */}
      <Modal visible={showFilters} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="chevron-down" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => {
                setDifficultyFilter("all");
                setPriceRange([0, 10000]);
              }}
            >
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Difficulty Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Difficulty Level</Text>
              {(["all", "easy", "moderate", "hard"] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={styles.filterOption}
                  onPress={() => setDifficultyFilter(level)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      difficultyFilter === level && styles.checkboxActive,
                    ]}
                  >
                    {difficultyFilter === level && (
                      <Ionicons name="checkmark" size={16} color="#007AFF" />
                    )}
                  </View>
                  <Text style={styles.filterOptionText}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceDisplay}>
                <Text style={styles.priceText}>
                  ${priceRange[0]} - ${priceRange[1]}
                </Text>
              </View>
              <View style={styles.pricePresets}>
                {[
                  { label: "Under $500", range: [0, 500] as [number, number] },
                  {
                    label: "$500 - $1000",
                    range: [500, 1000] as [number, number],
                  },
                  {
                    label: "$1000 - $2000",
                    range: [1000, 2000] as [number, number],
                  },
                  {
                    label: "Over $2000",
                    range: [2000, 10000] as [number, number],
                  },
                  {
                    label: "All prices",
                    range: [0, 10000] as [number, number],
                  },
                ].map((preset) => (
                  <TouchableOpacity
                    key={preset.label}
                    style={[
                      styles.pricePreset,
                      priceRange[0] === preset.range[0] &&
                        priceRange[1] === preset.range[1] &&
                        styles.pricePresetActive,
                    ]}
                    onPress={() => setPriceRange(preset.range)}
                  >
                    <Text
                      style={[
                        styles.pricePresetText,
                        priceRange[0] === preset.range[0] &&
                          priceRange[1] === preset.range[1] &&
                          styles.pricePresetTextActive,
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={{ paddingBottom: insets.bottom }}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={showSortMenu} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSortMenu(false)}>
              <Ionicons name="chevron-down" size={28} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sort By</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.modalContent}>
            {(
              [
                "popular",
                "rating",
                "price-low",
                "price-high",
                "newest",
              ] as const
            ).map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option);
                  setShowSortMenu(false);
                }}
              >
                <View
                  style={[
                    styles.checkbox,
                    sortBy === option && styles.checkboxActive,
                  ]}
                >
                  {sortBy === option && (
                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                  )}
                </View>
                <Text style={styles.filterOptionText}>
                  {option === "price-low"
                    ? "Price: Low to High"
                    : option === "price-high"
                      ? "Price: High to Low"
                      : option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  listContent: {
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    paddingRight: 16,
    paddingLeft: 2,
    // margin: 16,
  },
  gridRow: {
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImageContainer: {
    width: "100%",
    height: CARD_WIDTH * 0.8,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  gridDifficultyBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gridDifficultyText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  gridRatingBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gridRatingText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  gridContent: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  gridLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  gridLocationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  gridLocation: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#007AFF",
  },
  searchSection: {
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    gap: 6,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
  activeFiltersContainer: {
    marginBottom: 12,
  },
  activeFiltersLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "500",
  },
  activeFiltersList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    gap: 6,
  },
  filterTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  resultsInfo: {
    marginTop: 8,
  },
  resultsText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  resetButton: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F9FF",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  priceDisplay: {
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  pricePresets: {
    gap: 8,
  },
  pricePreset: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
  },
  pricePresetActive: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F9FF",
  },
  pricePresetText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  pricePresetTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  applyButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default SearchScreen;
