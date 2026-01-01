import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ListingFormData } from "../../types/listing";

interface ReviewStepProps {
  formData: ListingFormData;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const formatDate = (date: Date | null) => {
    return date
      ? date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not set";
  };

  const calculateDuration = () => {
    if (formData.start_date && formData.end_date) {
      const diff = formData.end_date.getTime() - formData.start_date.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "Invalid dates";
    }
    return "Not set";
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Review Your Listing</Text>
        <Text style={styles.subtitle}>
          Please review all information before publishing
        </Text>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.card}>
          <DetailRow label="Title" value={formData.title || "Not provided"} />
          <DetailRow
            label="Destination"
            value={formData.destination || "Not provided"}
          />
          <DetailRow
            label="Short Description"
            value={formData.short_description || "Not provided"}
          />
          <DetailRow
            label="Full Description"
            value={formData.description || "Not provided"}
            multiline
          />
          {formData.tags.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tags</Text>
              <View style={styles.tagsContainer}>
                {formData.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Dates & Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dates & Pricing</Text>
        <View style={styles.card}>
          <DetailRow
            label="Start Date"
            value={formatDate(formData.start_date)}
          />
          <DetailRow label="End Date" value={formatDate(formData.end_date)} />
          <DetailRow label="Duration" value={calculateDuration()} />
          <DetailRow
            label="Price Range"
            value={`${formData.currency} ${formData.price_min || 0} - ${formData.price_max || formData.price_min || 0}`}
          />
        </View>
      </View>

      {/* Group Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Group Details</Text>
        <View style={styles.card}>
          <DetailRow
            label="Max Group Size"
            value={formData.max_group_size.toString()}
          />
          <DetailRow
            label="Available Spots"
            value={formData.available_spots.toString()}
          />
          <DetailRow
            label="Age Range"
            value={`${formData.age_range_min} - ${formData.age_range_max} years`}
          />
          <DetailRow
            label="Activity Level"
            value={
              formData.difficulty.charAt(0).toUpperCase() +
              formData.difficulty.slice(1)
            }
          />
        </View>
      </View>

      {/* What's Included */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What&apos;s Included</Text>
        <View style={styles.card}>
          {formData.included_items.length > 0 ? (
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Included:</Text>
              {formData.included_items.map((item, index) => (
                <View key={item.id} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>✓</Text>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    {item.description && (
                      <Text style={styles.listItemDescription}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No included items</Text>
          )}

          {formData.not_included_items.length > 0 && (
            <View style={styles.listSection}>
              <Text style={styles.listTitle}>Not Included:</Text>
              {formData.not_included_items.map((item, index) => (
                <View key={item.id} style={styles.listItem}>
                  <Text style={styles.listItemBullet}>✗</Text>
                  <View style={styles.listItemContent}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    {item.description && (
                      <Text style={styles.listItemDescription}>
                        {item.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {formData.cancellation_policy && (
            <View style={styles.policySection}>
              <Text style={styles.listTitle}>Cancellation Policy:</Text>
              <Text style={styles.policyText}>
                {formData.cancellation_policy}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Itinerary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Itinerary</Text>
        <View style={styles.card}>
          {formData.itinerary.length > 0 ? (
            formData.itinerary.map((day) => (
              <View key={day.id} style={styles.dayItem}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day {day.day}</Text>
                </View>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.dayDescription}>{day.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No itinerary added</Text>
          )}
        </View>
      </View>

      {/* Photos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.card}>
          {formData.photos.length > 0 ? (
            <Text style={styles.photoCount}>
              {formData.photos.length} photo
              {formData.photos.length > 1 ? "s" : ""} added
            </Text>
          ) : (
            <Text style={styles.emptyText}>No photos added</Text>
          )}
        </View>
      </View>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>ℹ️</Text>
        <View style={styles.warningContent}>
          <Text style={styles.warningTitle}>Ready to publish?</Text>
          <Text style={styles.warningText}>
            Make sure all information is accurate. You can edit your listing
            after publishing.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  multiline?: boolean;
}> = ({ label, value, multiline }) => (
  <View style={[styles.detailRow, multiline && styles.detailRowMultiline]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[styles.detailValue, multiline && styles.detailValueMultiline]}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  detailRowMultiline: {
    flexDirection: "column",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  detailValue: {
    fontSize: 14,
    color: "#111827",
    textAlign: "right",
    flex: 1,
  },
  detailValueMultiline: {
    textAlign: "left",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#dbeafe",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    color: "#1e40af",
    fontSize: 12,
    fontWeight: "600",
  },
  listSection: {
    gap: 8,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  listItem: {
    flexDirection: "row",
    gap: 8,
  },
  listItemBullet: {
    fontSize: 16,
    color: "#10b981",
    fontWeight: "700",
  },
  listItemContent: {
    flex: 1,
    gap: 2,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  listItemDescription: {
    fontSize: 13,
    color: "#6b7280",
  },
  policySection: {
    marginTop: 12,
    gap: 8,
  },
  policyText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  dayItem: {
    gap: 8,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dayBadge: {
    backgroundColor: "#dbeafe",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayBadgeText: {
    color: "#1e40af",
    fontWeight: "700",
    fontSize: 12,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  dayDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  photoCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    fontStyle: "italic",
  },
  warningCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    marginBottom: 100,
  },
  warningIcon: {
    fontSize: 24,
  },
  warningContent: {
    flex: 1,
    gap: 4,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
  },
  warningText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
});
