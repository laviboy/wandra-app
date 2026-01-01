import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useAuthStore } from "../../Auth/hooks/useAuthStore";
import { createListing } from "../api/listingsApi";
import { FormNavigation } from "../components/FormNavigation";
import { ProgressIndicator } from "../components/ProgressIndicator";
import { StepContainer } from "../components/StepContainer";
import { BasicInfoStep } from "../components/steps/BasicInfoStep";
import { DatesPricingStep } from "../components/steps/DatesPricingStep";
import { GroupDetailsStep } from "../components/steps/GroupDetailsStep";
import { ItineraryStep } from "../components/steps/ItineraryStep";
import { PhotosStep } from "../components/steps/PhotosStep";
import { ReviewStep } from "../components/steps/ReviewStep";
import { WhatsIncludedStep } from "../components/steps/WhatsIncludedStep";
import { useListingForm } from "../hooks/useListingForm";
import { CreateListingPayload } from "../types/listing";

const STEP_TITLES = [
  "Basic Info",
  "Dates & Pricing",
  "Group Details",
  "What's Included",
  "Itinerary",
  "Photos",
  "Review & Publish",
];

const AddScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const { user } = useAuthStore();

  const {
    formData,
    currentStep,
    updateFormData,
    resetForm,
    validateStep,
    canProceedToNextStep,
    goToNextStep,
    goToPreviousStep,
  } = useListingForm();

  const handleNext = () => {
    const validation = validateStep(currentStep);

    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.errors.join("\n"), [
        { text: "OK" },
      ]);
      return;
    }

    if (currentStep === 7) {
      handlePublish();
    } else {
      goToNextStep();
    }
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const handleSaveDraft = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a draft");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload: CreateListingPayload = {
        title: formData.title,
        destination: formData.destination,
        short_description: formData.short_description || null,
        description: formData.description || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        start_date: formData.start_date
          ? formData.start_date.toISOString()
          : null,
        end_date: formData.end_date ? formData.end_date.toISOString() : null,
        price_min: formData.price_min,
        price_max: formData.price_max,
        currency: formData.currency,
        max_group_size: formData.max_group_size,
        available_spots: formData.available_spots,
        age_range_min: formData.age_range_min,
        age_range_max: formData.age_range_max,
        difficulty: formData.difficulty,
        included_items: formData.included_items,
        not_included_items: formData.not_included_items,
        cancellation_policy: formData.cancellation_policy || null,
        itinerary: formData.itinerary,
        status: "draft",
      };

      await createListing(payload, user.id, formData.photos);

      Alert.alert("Draft Saved", "Your listing has been saved as a draft.", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save draft. Please try again.");
      console.error("Save draft error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to publish a listing");
      return;
    }

    const validation = validateStep(7);
    if (!validation.isValid) {
      Alert.alert(
        "Cannot Publish",
        "Please complete all required fields:\n\n" +
          validation.errors.join("\n"),
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Publish Listing",
      "Are you sure you want to publish this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Publish",
          onPress: async () => {
            try {
              setIsSubmitting(true);

              const payload: CreateListingPayload = {
                title: formData.title,
                destination: formData.destination,
                short_description: formData.short_description || null,
                description: formData.description || null,
                tags: formData.tags.length > 0 ? formData.tags : null,
                start_date: formData.start_date
                  ? formData.start_date.toISOString()
                  : null,
                end_date: formData.end_date
                  ? formData.end_date.toISOString()
                  : null,
                price_min: formData.price_min,
                price_max: formData.price_max,
                currency: formData.currency,
                max_group_size: formData.max_group_size,
                available_spots: formData.available_spots,
                age_range_min: formData.age_range_min,
                age_range_max: formData.age_range_max,
                difficulty: formData.difficulty,
                included_items: formData.included_items,
                not_included_items: formData.not_included_items,
                cancellation_policy: formData.cancellation_policy || null,
                itinerary: formData.itinerary,
                status: "published",
              };

              await createListing(payload, user.id, formData.photos);

              // TODO: Upload photos after listing is created
              // for (let i = 0; i < formData.photos.length; i++) {
              //   await uploadListingImage(listing.id, formData.photos[i], i);
              // }

              Alert.alert(
                "Success!",
                "Your listing has been published successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      resetForm();
                      // TODO: Navigate to listing detail or home
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to publish listing. Please try again."
              );
              console.error("Publish error:", error);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <DatesPricingStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <GroupDetailsStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <WhatsIncludedStep
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <ItineraryStep formData={formData} updateFormData={updateFormData} />
        );
      case 6:
        return (
          <PhotosStep
            formData={formData}
            updateFormData={updateFormData}
            onUploadStateChange={setIsUploadingPhotos}
          />
        );
      case 7:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={7}
        stepTitles={STEP_TITLES}
      />

      <StepContainer currentStep={currentStep}>{renderStep()}</StepContainer>

      <FormNavigation
        onNext={handleNext}
        onBack={handleBack}
        onSaveDraft={handleSaveDraft}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 7}
        isNextDisabled={!canProceedToNextStep(currentStep) || isUploadingPhotos}
        isLoading={isSubmitting || isUploadingPhotos}
        nextLabel={currentStep === 7 ? "Publish Listing" : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
});

export default AddScreen;
