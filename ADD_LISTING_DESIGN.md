# Add Listing Flow - UI/UX Design Documentation

## Overview
This document outlines the UI/UX design decisions for the 7-step add listing flow in the Wandra mobile app.

## Design Philosophy

### 1. **Progressive Disclosure**
- Information is collected in logical, digestible chunks
- Each step focuses on a related set of information
- Users aren't overwhelmed with a single long form

### 2. **Visual Progress Tracking**
- Clear progress indicator at the top showing "Step X of 7"
- Step title displayed prominently
- Progress bar provides visual feedback
- Dot indicators show completion status

### 3. **Mobile-First Design**
- Large touch targets (48px minimum height for buttons)
- Adequate spacing between interactive elements
- Keyboard-aware scrolling with KeyboardAvoidingView
- Bottom-anchored navigation for thumb-friendly access

## Step Breakdown

### Step 1: Basic Info
**Purpose**: Capture the essential listing information
- **Fields**: Title, Destination, Short Description, Full Description, Tags
- **UX Features**:
  - Character counter for short description (150 max)
  - Tag system with visual chips
  - Easy tag removal with "×" button
  - Inline add button for tags

### Step 2: Dates & Pricing
**Purpose**: Define temporal and financial details
- **Fields**: Start Date, End Date, Price Range, Currency
- **UX Features**:
  - Auto-calculated duration display
  - Currency selector with horizontal buttons
  - Visual feedback for selected currency
  - Price range with min/max inputs side by side
  - Currency symbol prefix in input fields

### Step 3: Group Details
**Purpose**: Specify group size and requirements
- **Fields**: Max Group Size, Available Spots, Age Range, Difficulty Level
- **UX Features**:
  - Radio-button style selection for difficulty
  - Descriptive text for each difficulty level
  - Visual active state with color change
  - Helper text explaining field purpose

### Step 4: What's Included
**Purpose**: Detail what's included and excluded
- **Fields**: Included Items, Not Included Items, Cancellation Policy
- **UX Features**:
  - Dynamic item cards that can be added/removed
  - Separate sections for included vs not included
  - Item numbering for easy reference
  - Empty state messages
  - Optional description fields for additional context

### Step 5: Itinerary
**Purpose**: Create day-by-day schedule
- **Fields**: Daily activities with title and description
- **UX Features**:
  - Day badges showing "Day 1", "Day 2", etc.
  - Automatic day numbering
  - Cards with clear visual hierarchy
  - Empty state with emoji and encouraging text
  - Add/remove functionality

### Step 6: Photos
**Purpose**: Upload visual content
- **Fields**: Photo uploads (max 10)
- **UX Features**:
  - Large upload button with clear call-to-action
  - Photo counter showing X/10
  - First photo marked as "Cover"
  - Reorder buttons (← →) for each photo
  - Remove button on each photo
  - Photo tips card with best practices
  - Placeholder for image picker integration

### Step 7: Review
**Purpose**: Final review before publishing
- **UX Features**:
  - Comprehensive summary of all steps
  - Organized by sections matching previous steps
  - Read-only display with clear hierarchy
  - Visual elements (tags, badges) maintained
  - Info banner at bottom with final reminders

## Navigation Pattern

### Bottom Navigation Bar
- **Fixed Position**: Anchored to bottom for easy thumb access
- **Adaptive Buttons**:
  - Step 1: Only "Next" button (full width)
  - Steps 2-6: "Back", "Save Draft", "Next" buttons
  - Step 7: "Back" and "Publish Listing" buttons

### Button Hierarchy
1. **Primary (Next/Publish)**: Blue, right-aligned, most prominent
2. **Secondary (Back)**: Gray, less prominent
3. **Tertiary (Save Draft)**: Outlined, middle position

### Smart Validation
- Validation occurs on "Next" button press
- Clear error messages in Alert dialog
- Next button disabled if step is incomplete
- Visual feedback (grayed out) when disabled

## Form State Management

### Hook-Based Architecture
- `useListingForm` hook manages all form state
- Centralized validation logic
- Easy to test and maintain

### Validation Strategy
- **Per-Step Validation**: Prevents progression with invalid data
- **Final Validation**: Comprehensive check before publish
- **Clear Error Messages**: Specific, actionable feedback

### Draft Functionality
- Save progress at any step
- Status set to 'draft' in database
- User can resume later (future feature)

## Color Palette

### Primary Colors
- **Primary Blue**: `#3b82f6` - CTAs, active states
- **Success Green**: `#10b981` - Completed states, positive feedback
- **Error Red**: `#ef4444` - Remove buttons, errors
- **Info Blue**: `#1e40af` - Badges, tags, info cards

### Neutral Colors
- **Gray 900**: `#111827` - Primary text
- **Gray 600**: `#6b7280` - Secondary text
- **Gray 400**: `#9ca3af` - Placeholder text
- **Gray 300**: `#d1d5db` - Borders
- **Gray 100**: `#f3f4f6` - Subtle backgrounds
- **Gray 50**: `#f9fafb` - Page background

## Typography

### Hierarchy
- **Page Title**: 24px, Bold (700)
- **Section Title**: 18-20px, Bold (700)
- **Field Label**: 16px, Semibold (600)
- **Body Text**: 14-16px, Regular (400)
- **Helper Text**: 12-14px, Regular (400)

## Accessibility Considerations

1. **Touch Targets**: Minimum 48px height for all interactive elements
2. **Color Contrast**: All text meets WCAG AA standards
3. **Clear Labels**: Every input has a descriptive label
4. **Error Feedback**: Validation errors are clearly communicated
5. **Progress Indication**: Multiple forms of progress feedback

## Mobile UX Best Practices Applied

### 1. **One Thing at a Time**
- Each step focuses on a single concept
- Reduces cognitive load
- Improves completion rates

### 2. **Smart Defaults**
- Pre-filled with sensible defaults (e.g., USD, 12 people, moderate difficulty)
- Reduces user effort
- Speeds up form completion

### 3. **Forgiving Inputs**
- Optional fields clearly marked
- Draft save allows incomplete submission
- Users can go back and edit

### 4. **Visual Feedback**
- Active states for all interactive elements
- Loading states during submission
- Success/error confirmations

### 5. **Contextual Help**
- Helper text under inputs
- Placeholder examples in inputs
- Tips card in photo step

## Future Enhancements

1. **DatePicker Integration**: Use `@react-native-community/datetimepicker`
2. **Image Picker**: Integrate `expo-image-picker` for photo uploads
3. **Auto-Save**: Periodic draft saving as user types
4. **Step Validation Indicators**: Show check marks on completed steps
5. **Edit from Review**: Quick jump to specific steps from review
6. **Location Autocomplete**: Google Places API for destination field
7. **Rich Text Editor**: For descriptions with formatting
8. **Drag-and-Drop Photos**: Better photo reordering UX
9. **Preview Mode**: See how listing appears before publishing
10. **Analytics**: Track step completion rates and drop-off points

## Technical Implementation Notes

### Key Components
- `ProgressIndicator`: Reusable progress display
- `StepContainer`: Handles keyboard and scroll behavior
- `FormNavigation`: Smart navigation with validation
- Individual step components: Focused, testable, maintainable

### State Management
- Single source of truth in `useListingForm` hook
- Type-safe with TypeScript
- Easy to extend with new fields

### API Integration
- Clean separation of concerns
- Error handling at component level
- Loading states for async operations

## Conclusion

This multi-step form design prioritizes:
- **User Experience**: Clear, logical flow with helpful guidance
- **Mobile Optimization**: Touch-friendly, thumb-accessible design
- **Completion Rate**: Progressive disclosure and draft saving
- **Data Quality**: Smart validation and clear error messaging
- **Maintainability**: Clean architecture with reusable components
