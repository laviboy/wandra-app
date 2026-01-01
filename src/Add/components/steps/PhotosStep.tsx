import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../../utils/supabase";
import { ListingFormData } from "../../types/listing";

interface PhotosStepProps {
  formData: ListingFormData;
  updateFormData: (data: Partial<ListingFormData>) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
}

const MAX_PHOTOS = 10;

export const PhotosStep: React.FC<PhotosStepProps> = ({
  formData,
  updateFormData,
  onUploadStateChange,
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<string>("");

  const uploadImageToSupabase = async (
    uri: string,
    index: number
  ): Promise<{ url: string; storage_path: string }> => {
    try {
      console.log("📤 Starting upload for:", uri);

      // Create form data for file upload
      const fileName = uri.split("/").pop() || `photo-${Date.now()}.jpg`;
      const fileExt = fileName.split(".").pop() || "jpg";
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${index}.${fileExt}`;

      // Read file as base64 for React Native
      const base64 = await fetch(uri)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result as string;
                // Remove data:image/xxx;base64, prefix
                const base64String = base64data.split(",")[1];
                resolve(base64String);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
        );

      console.log("📦 Uploading to Supabase storage:", uniqueFileName);

      // Upload to Supabase storage using base64
      const { data, error } = await supabase.storage
        .from("listings-images")
        .upload(uniqueFileName, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.error("❌ Upload error:", error);
        throw error;
      }

      console.log("✅ Upload successful:", data.path);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("listings-images").getPublicUrl(data.path);

      console.log("🔗 Public URL:", publicUrl);

      return {
        url: publicUrl,
        storage_path: data.path,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Helper function to decode base64
  const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const pickImage = async () => {
    if (formData.photos.length >= MAX_PHOTOS) {
      Alert.alert(
        "Maximum photos reached",
        "You can only upload up to 10 photos"
      );
      return;
    }

    try {
      console.log("🎯 Requesting permissions...");
      // Request permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "You need to grant camera roll permissions to upload photos."
        );
        return;
      }

      console.log("✅ Permission granted, launching picker...");
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: MAX_PHOTOS - formData.photos.length,
      });

      console.log("📸 Picker result:", result);

      if (!result.canceled && result.assets.length > 0) {
        console.log(`📷 Selected ${result.assets.length} photos`);
        setIsUploading(true);
        onUploadStateChange?.(true);

        try {
          const uploadPromises = result.assets.map((asset, index) => {
            console.log(`🔄 Processing photo ${index + 1}:`, asset.uri);
            const currentIndex = formData.photos.length + index;
            setUploadProgress(
              `Uploading ${index + 1} of ${result.assets.length}...`
            );
            return uploadImageToSupabase(asset.uri, currentIndex);
          });

          const uploadedPhotos = await Promise.all(uploadPromises);
          console.log("✅ All photos uploaded:", uploadedPhotos);

          updateFormData({ photos: [...formData.photos, ...uploadedPhotos] });
          console.log("✅ Form data updated");

          Alert.alert("Success", "Photos uploaded successfully!");
        } catch (error) {
          Alert.alert(
            "Upload Failed",
            "Failed to upload photos. Please try again."
          );
          console.error("Upload error:", error);
        } finally {
          setIsUploading(false);
          setUploadProgress("");
          onUploadStateChange?.(false);
        }
      } else {
        console.log("❌ Picker was canceled or no assets selected");
      }
    } catch (error) {
      console.error("❌ Error in pickImage:", error);
      Alert.alert("Error", "Failed to open image picker");
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData({ photos: updatedPhotos });
  };

  const reorderPhotos = (fromIndex: number, toIndex: number) => {
    const updatedPhotos = [...formData.photos];
    const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
    updatedPhotos.splice(toIndex, 0, movedPhoto);
    updateFormData({ photos: updatedPhotos });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Travel Photos</Text>
        <Text style={styles.subtitle}>
          Add up to {MAX_PHOTOS} photos. First photo will be the cover image.
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.uploadButton,
          (formData.photos.length >= MAX_PHOTOS || isUploading) &&
            styles.uploadButtonDisabled,
        ]}
        onPress={pickImage}
        disabled={formData.photos.length >= MAX_PHOTOS || isUploading}
      >
        {isUploading ? (
          <>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.uploadText}>{uploadProgress}</Text>
          </>
        ) : (
          <>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>
              {formData.photos.length >= MAX_PHOTOS
                ? "Maximum photos reached"
                : "Tap to add photos"}
            </Text>
            <Text style={styles.uploadSubtext}>
              {formData.photos.length}/{MAX_PHOTOS} photos
            </Text>
          </>
        )}
      </TouchableOpacity>

      {formData.photos.length > 0 && (
        <View style={styles.photosGrid}>
          {formData.photos.map((photo, index) => (
            <View key={index} style={styles.photoCard}>
              <Image source={{ uri: photo.url }} style={styles.photoImage} />

              {index === 0 && (
                <View style={styles.coverBadge}>
                  <Text style={styles.coverBadgeText}>Cover</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={() => removePhoto(index)}
              >
                <Text style={styles.removePhotoText}>×</Text>
              </TouchableOpacity>

              <View style={styles.photoActions}>
                {index > 0 && (
                  <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={() => reorderPhotos(index, index - 1)}
                  >
                    <Text style={styles.reorderButtonText}>←</Text>
                  </TouchableOpacity>
                )}
                {index < formData.photos.length - 1 && (
                  <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={() => reorderPhotos(index, index + 1)}
                  >
                    <Text style={styles.reorderButtonText}>→</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {formData.photos.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🖼️</Text>
          <Text style={styles.emptyStateTitle}>No photos added yet</Text>
          <Text style={styles.emptyStateText}>
            Add photos to showcase your travel experience
          </Text>
        </View>
      )}

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Photo Tips:</Text>
        <Text style={styles.tipText}>• Use high-quality, well-lit photos</Text>
        <Text style={styles.tipText}>• Show destinations and activities</Text>
        <Text style={styles.tipText}>
          • First photo appears as the main listing image
        </Text>
        <Text style={styles.tipText}>• Drag photos to reorder them</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  uploadButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#3b82f6",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  uploadButtonDisabled: {
    borderColor: "#d1d5db",
    opacity: 0.6,
  },
  uploadIcon: {
    fontSize: 48,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  uploadSubtext: {
    fontSize: 14,
    color: "#6b7280",
  },
  photosGrid: {
    gap: 12,
  },
  photoCard: {
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  photoImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f3f4f6",
  },
  coverBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  coverBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  removePhotoButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ef4444",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "600",
    marginTop: -2,
  },
  photoActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    padding: 8,
    backgroundColor: "#f9fafb",
  },
  reorderButton: {
    backgroundColor: "#e5e7eb",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  reorderButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  emptyState: {
    backgroundColor: "#f9fafb",
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  emptyStateIcon: {
    fontSize: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  tipsCard: {
    backgroundColor: "#eff6ff",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#1e40af",
  },
});
