# Add Listing Implementation Guide

## 📋 Overview

A complete 7-step mobile-optimized form for creating travel listings with professional UI/UX design patterns.

## 🎯 Features

✅ **7-Step Progressive Form**
- Basic Info → Dates & Pricing → Group Details → What's Included → Itinerary → Photos → Review

✅ **Mobile-First Design**
- Large touch targets (48px minimum)
- Bottom-anchored navigation
- Keyboard-aware scrolling
- Thumb-friendly interactions

✅ **Smart Validation**
- Per-step validation
- Clear error messages
- Disabled next button when incomplete

✅ **Draft Saving**
- Save progress at any step
- Resume later (future feature)

✅ **Visual Progress**
- Progress bar
- Step counter (X of 7)
- Dot indicators
- Step titles

## 📁 File Structure

```
src/Add/
├── api/
│   └── listingsApi.ts          # API functions for creating/updating listings
├── components/
│   ├── steps/
│   │   ├── BasicInfoStep.tsx
│   │   ├── DatesPricingStep.tsx
│   │   ├── GroupDetailsStep.tsx
│   │   ├── WhatsIncludedStep.tsx
│   │   ├── ItineraryStep.tsx
│   │   ├── PhotosStep.tsx
│   │   └── ReviewStep.tsx
│   ├── ProgressIndicator.tsx   # Progress bar & dots
│   ├── StepContainer.tsx       # Keyboard-aware scroll wrapper
│   ├── FormNavigation.tsx      # Bottom navigation buttons
│   └── index.ts                # Barrel exports
├── hooks/
│   └── useListingForm.ts       # Form state & validation logic
├── screens/
│   └── AddScreen.tsx           # Main container component
└── types/
    └── listing.ts              # TypeScript types
```

## 🚀 Usage

### Basic Implementation

The main `AddScreen` component is already fully integrated:

```tsx
import AddScreen from './src/Add/screens/AddScreen';

// Use it in your navigation
<Tab.Screen name="Add" component={AddScreen} />
```

### Form State Management

The form uses a custom hook for state management:

```tsx
import { useListingForm } from '../hooks/useListingForm';

const {
  formData,           // Current form data
  currentStep,        // Current step number (1-7)
  updateFormData,     // Update form fields
  resetForm,          // Reset to initial state
  validateStep,       // Validate specific step
  canProceedToNextStep, // Check if can proceed
  goToNextStep,       // Navigate to next step
  goToPreviousStep,   // Navigate to previous step
  goToStep,           // Jump to specific step
} = useListingForm();
```

## 🔧 Configuration

### Step Titles

Customize step titles in `AddScreen.tsx`:

```tsx
const STEP_TITLES = [
  'Basic Info',
  'Dates & Pricing',
  'Group Details',
  "What's Included",
  'Itinerary',
  'Photos',
  'Review & Publish',
];
```

### Default Values

Modify defaults in `useListingForm.ts`:

```tsx
const initialFormData: ListingFormData = {
  currency: 'USD',           // Default currency
  max_group_size: 12,        // Default max group size
  available_spots: 10,       // Default available spots
  age_range_min: 18,         // Default min age
  age_range_max: 65,         // Default max age
  difficulty: 'moderate',    // Default difficulty
  // ... other defaults
};
```

### Color Scheme

Colors are defined inline in component StyleSheets. Key colors:

```tsx
primaryBlue: '#3b82f6'
successGreen: '#10b981'
errorRed: '#ef4444'
gray900: '#111827'
gray100: '#f9fafb'
```

## 📝 Form Steps Details

### Step 1: Basic Info
- **Required**: Title, Destination, Short Description, Full Description
- **Optional**: Tags (array of strings)

### Step 2: Dates & Pricing
- **Required**: Start Date, End Date, Min Price, Currency
- **Optional**: Max Price
- **Auto-calculated**: Duration (days)

### Step 3: Group Details
- **Required**: Max Group Size, Available Spots, Age Range, Difficulty Level
- **Validation**: Available spots ≤ Max group size, Age max > Age min

### Step 4: What's Included
- **Optional**: All fields
- **Dynamic**: Add/remove included items, not included items
- **Text Area**: Cancellation policy

### Step 5: Itinerary
- **Optional**: All fields
- **Dynamic**: Add/remove daily itinerary items
- **Auto-numbered**: Day 1, Day 2, etc.

### Step 6: Photos
- **Optional**: All photos
- **Limit**: Maximum 10 photos
- **Features**: Reorder, remove, first photo as cover

### Step 7: Review
- **Read-only**: Summary of all previous steps
- **Action**: Publish or go back to edit

## 🔐 Validation Rules

### Per-Step Validation

```typescript
// Step 1: Basic Info
- Title: Required, non-empty
- Destination: Required, non-empty
- Short Description: Required, max 150 chars
- Full Description: Required, non-empty

// Step 2: Dates & Pricing
- Start Date: Required
- End Date: Required, must be after start date
- Min Price: Required, > 0
- Max Price: Optional, must be > min price

// Step 3: Group Details
- Max Group Size: Required, ≥ 1
- Available Spots: Required, ≥ 0, ≤ max group size
- Age Min: Required, ≥ 0
- Age Max: Required, > age min

// Steps 4-6: Optional with conditional validation
// If items are added, they must be complete
```

## 🎨 Customization

### Adding a New Step

1. Create step component in `src/Add/components/steps/`
2. Add to `STEP_TITLES` array
3. Add case to `renderStep()` in `AddScreen.tsx`
4. Add validation logic in `useListingForm.ts`
5. Update total steps count (currently 7)

### Styling

Each component has its own StyleSheet. Modify styles inline or extract to a theme:

```tsx
// Example: Change primary button color
buttonPrimary: {
  backgroundColor: '#your-color',
}
```

## 🔌 Integration Points

### DatePicker (TODO)

Replace placeholder with actual date picker:

```tsx
// In DatesPricingStep.tsx
import DateTimePicker from '@react-native-community/datetimepicker';

// Replace TouchableOpacity with DateTimePicker
<DateTimePicker
  value={formData.start_date || new Date()}
  mode="date"
  onChange={(event, date) => updateFormData({ start_date: date })}
/>
```

### Image Picker (TODO)

Replace placeholder with actual image picker:

```tsx
// In PhotosStep.tsx
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
  });

  if (!result.canceled) {
    updateFormData({ 
      photos: [...formData.photos, ...result.assets.map(a => a.uri)] 
    });
  }
};
```

### API Integration

The API layer is ready in `src/Add/api/listingsApi.ts`:

```tsx
// Create listing
await createListing(payload, userId);

// Update listing
await updateListing(listingId, updates);

// Upload image (TODO: implement storage)
await uploadListingImage(listingId, imageUri, displayOrder);
```

## 🧪 Testing Checklist

- [ ] All 7 steps render correctly
- [ ] Validation prevents invalid progression
- [ ] Error messages are clear and helpful
- [ ] Back button works on all steps
- [ ] Save draft saves to database
- [ ] Publish creates listing with correct status
- [ ] Form resets after successful publish
- [ ] Keyboard doesn't hide inputs
- [ ] Navigation buttons are accessible
- [ ] Progress indicator updates correctly

## 🐛 Known Limitations

1. **DatePicker**: Placeholder implementation, needs integration
2. **ImagePicker**: Placeholder implementation, needs integration
3. **Image Upload**: Storage integration not implemented
4. **Auto-save**: No periodic draft saving yet
5. **Edit Mode**: Can't load existing draft/listing for editing

## 📚 Dependencies

Required packages (should already be installed):
- `react`
- `react-native`
- `@react-navigation/native` (for navigation)
- Your Supabase client setup

Optional packages for full functionality:
- `@react-native-community/datetimepicker` (for date selection)
- `expo-image-picker` (for photo uploads)

## 💡 Best Practices

1. **Always validate before proceeding**: Use `canProceedToNextStep()`
2. **Show loading states**: Use `isLoading` prop in FormNavigation
3. **Handle errors gracefully**: Show user-friendly error messages
4. **Save drafts frequently**: Encourage users to save progress
5. **Test on real devices**: Keyboard behavior differs across devices

## 🎓 Learning Resources

- **Multi-step Forms**: [Read the design doc](./ADD_LISTING_DESIGN.md)
- **Form Validation**: See `useListingForm.ts` for validation patterns
- **Mobile UX**: Review component implementations for best practices

## 🤝 Contributing

When adding features:
1. Follow existing patterns
2. Add validation rules
3. Update TypeScript types
4. Test on iOS and Android
5. Update this documentation

## 📞 Support

For issues or questions:
1. Check [ADD_LISTING_DESIGN.md](./ADD_LISTING_DESIGN.md) for design decisions
2. Review component source code (well-commented)
3. Check validation logic in `useListingForm.ts`

---

**Ready to use!** The implementation is complete and production-ready (minus image picker and date picker integrations).
