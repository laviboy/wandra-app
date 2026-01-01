import { useState } from "react";
import { ListingFormData } from "../types/listing";

const initialFormData: ListingFormData = {
  // Step 1: Basic Info
  title: "",
  destination: "",
  short_description: "",
  description: "",
  tags: [],

  // Step 2: Dates & Pricing
  start_date: null,
  end_date: null,
  price_min: null,
  price_max: null,
  currency: "MYR",

  // Step 3: Group Details
  max_group_size: 12,
  available_spots: 10,
  age_range_min: 18,
  age_range_max: 65,
  difficulty: "moderate",

  // Step 4: What's Included
  included_items: [],
  not_included_items: [],
  cancellation_policy: "",

  // Step 5: Itinerary
  itinerary: [],

  // Step 6: Photos
  photos: [],
};

export const useListingForm = () => {
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = (data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  const validateStep = (
    step: number
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (step) {
      case 1: // Basic Info
        if (!formData.title.trim()) errors.push("Title is required");
        if (!formData.destination.trim())
          errors.push("Destination is required");
        if (!formData.short_description.trim())
          errors.push("Short description is required");
        if (!formData.description.trim())
          errors.push("Full description is required");
        break;

      case 2: // Dates & Pricing
        if (!formData.start_date) errors.push("Start date is required");
        if (!formData.end_date) errors.push("End date is required");
        if (formData.start_date && formData.end_date) {
          if (formData.end_date <= formData.start_date) {
            errors.push("End date must be after start date");
          }
        }
        if (!formData.price_min || formData.price_min <= 0)
          errors.push("Minimum price is required");
        if (
          formData.price_max &&
          formData.price_min &&
          formData.price_max < formData.price_min
        ) {
          errors.push("Maximum price must be greater than minimum price");
        }
        break;

      case 3: // Group Details
        if (formData.max_group_size < 1)
          errors.push("Max group size must be at least 1");
        if (formData.available_spots < 0)
          errors.push("Available spots cannot be negative");
        if (formData.available_spots > formData.max_group_size)
          errors.push("Available spots cannot exceed max group size");
        if (formData.age_range_min < 0)
          errors.push("Minimum age cannot be negative");
        if (formData.age_range_max <= formData.age_range_min)
          errors.push("Maximum age must be greater than minimum age");
        break;

      case 4: // What's Included
        // Optional step, but validate if items are added
        const incompleteIncluded = formData.included_items.some(
          (item) => !item.title.trim()
        );
        if (incompleteIncluded)
          errors.push("All included items must have a title");

        const incompleteNotIncluded = formData.not_included_items.some(
          (item) => !item.title.trim()
        );
        if (incompleteNotIncluded)
          errors.push("All not included items must have a title");
        break;

      case 5: // Itinerary
        // Optional step, but validate if items are added
        const incompleteItinerary = formData.itinerary.some(
          (day) => !day.title.trim() || !day.description.trim()
        );
        if (incompleteItinerary)
          errors.push("All itinerary days must have a title and description");
        break;

      case 6: // Photos
        // Photos are optional
        break;

      case 7: // Review
        // Final validation - check all previous steps
        const allStepErrors = [];
        for (let i = 1; i <= 6; i++) {
          const stepValidation = validateStep(i);
          allStepErrors.push(...stepValidation.errors);
        }
        if (allStepErrors.length > 0) {
          errors.push(...allStepErrors);
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const canProceedToNextStep = (step: number): boolean => {
    return validateStep(step).isValid;
  };

  const goToNextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 7) {
      setCurrentStep(step);
    }
  };

  return {
    formData,
    currentStep,
    updateFormData,
    resetForm,
    validateStep,
    canProceedToNextStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
  };
};
