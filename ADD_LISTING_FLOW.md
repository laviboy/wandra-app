# Add Listing Flow - Visual Guide

## 📱 Screen Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│              Navigation Bar                          │
│                 "Add Listing"                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│         Progress Indicator (All Steps)               │
│   Step X of 7 • Progress Bar • Dot Indicators       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Step Content Area                       │
│          (Scrollable with keyboard aware)            │
│                                                       │
│   ┌─────────────────────────────────────────┐       │
│   │    Step 1: Basic Info                   │       │
│   │    • Title                               │       │
│   │    • Destination                         │       │
│   │    • Short Description                   │       │
│   │    • Full Description                    │       │
│   │    • Tags (Add/Remove)                   │       │
│   └─────────────────────────────────────────┘       │
│                                                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│          Bottom Navigation (Fixed)                   │
│   [Back] [Save Draft] [Next] or [Publish]          │
└─────────────────────────────────────────────────────┘
```

## 🔄 Step Navigation Flow

```
Step 1          Step 2          Step 3          Step 4
Basic Info  →   Dates &     →   Group       →   What's
                Pricing         Details         Included
   ↓               ↓               ↓               ↓
Required        Required        Required        Optional
Fields          Fields          Fields          but validated
   ↓               ↓               ↓               ↓
[Next]          [Next]          [Next]          [Next]
   ↓               ↓               ↓               ↓

Step 5          Step 6          Step 7
Itinerary   →   Photos      →   Review &
                                Publish
   ↓               ↓               ↓
Optional        Optional        Read-only
but validated   Max 10          Summary
   ↓               ↓               ↓
[Next]          [Next]          [Publish]
                                    ↓
                             ┌──────────────┐
                             │ Success!     │
                             │ Reset Form   │
                             │ Go to Home   │
                             └──────────────┘
```

## 💾 Save Draft Flow

```
Any Step (1-6)
      ↓
  [Save Draft]
      ↓
┌─────────────┐
│ Validation  │ (Optional fields OK)
└─────────────┘
      ↓
┌─────────────┐
│ Create      │
│ Listing     │
│ status:     │
│ 'draft'     │
└─────────────┘
      ↓
┌─────────────┐
│ Show        │
│ Success     │
│ Message     │
└─────────────┘
      ↓
┌─────────────┐
│ Reset Form  │
└─────────────┘
```

## ✅ Validation Flow

```
User clicks [Next]
      ↓
┌─────────────────┐
│ Validate        │
│ Current Step    │
└─────────────────┘
      ↓
   Is Valid?
   /     \
  NO      YES
  ↓        ↓
Show     Go to
Error    Next Step
Alert
  ↓
Stay on
Current
Step
```

## 🎨 UI Component Hierarchy

```
AddScreen (Main Container)
│
├── ProgressIndicator
│   ├── Step Text ("Step X of 7")
│   ├── Step Title
│   ├── Progress Bar (animated)
│   └── Dot Indicators
│
├── StepContainer (Scrollable + Keyboard Aware)
│   │
│   └── Current Step Component
│       │
│       ├── BasicInfoStep
│       │   ├── TextInput fields
│       │   └── Tag management
│       │
│       ├── DatesPricingStep
│       │   ├── Date buttons
│       │   ├── Currency selector
│       │   └── Price inputs
│       │
│       ├── GroupDetailsStep
│       │   ├── Number inputs
│       │   └── Difficulty selector (radio)
│       │
│       ├── WhatsIncludedStep
│       │   ├── Dynamic item lists
│       │   └── Cancellation policy
│       │
│       ├── ItineraryStep
│       │   └── Dynamic day cards
│       │
│       ├── PhotosStep
│       │   ├── Upload button
│       │   └── Photo grid with actions
│       │
│       └── ReviewStep
│           └── Read-only summary
│
└── FormNavigation (Fixed Bottom)
    ├── Back Button (if not first step)
    ├── Save Draft Button (if not last step)
    └── Next/Publish Button
```

## 📊 Data Flow

```
User Input
    ↓
┌─────────────────┐
│ Step Component  │
└─────────────────┘
    ↓
updateFormData()
    ↓
┌─────────────────┐
│ useListingForm  │ (Hook)
│ - formData      │
│ - validation    │
│ - navigation    │
└─────────────────┘
    ↓
State Updated
    ↓
Re-render UI
    ↓
User sees changes
    ↓
Proceeds to next step
    ↓
Step 7: Review
    ↓
User clicks Publish
    ↓
┌─────────────────┐
│ createListing() │ (API)
└─────────────────┘
    ↓
┌─────────────────┐
│ Supabase DB     │
└─────────────────┘
    ↓
Success Response
    ↓
Show success alert
    ↓
Reset form
```

## 🎯 User Journey

### Happy Path
```
1. User taps "Add" tab
   ↓
2. Sees Step 1: Basic Info
   ↓
3. Fills in title, destination, descriptions, tags
   ↓
4. Taps [Next]
   ↓
5. Validation passes → Goes to Step 2
   ↓
6. Selects dates, sets price, chooses currency
   ↓
7. Taps [Next]
   ↓
8. Continues through all steps...
   ↓
9. Reaches Step 7: Review
   ↓
10. Reviews all information
   ↓
11. Taps [Publish Listing]
   ↓
12. Confirmation alert appears
   ↓
13. Confirms → Listing created
   ↓
14. Success alert → Form resets
   ↓
15. Returns to home (or listing detail)
```

### Save Draft Path
```
1-5. Same as happy path
   ↓
6. User needs to leave
   ↓
7. Taps [Save Draft]
   ↓
8. Draft saved to database
   ↓
9. Success message
   ↓
10. Form resets
   ↓
11. Can resume later (future feature)
```

### Validation Error Path
```
1. User on any step
   ↓
2. Skips required fields
   ↓
3. Taps [Next]
   ↓
4. Validation fails
   ↓
5. Error alert shows specific issues
   ↓
6. User taps OK
   ↓
7. Stays on current step
   ↓
8. Fixes issues
   ↓
9. Taps [Next] again
   ↓
10. Validation passes → Proceeds
```

## 📱 Responsive Behavior

### Keyboard Management
```
User taps input field
    ↓
Keyboard appears
    ↓
KeyboardAvoidingView adjusts layout
    ↓
ScrollView scrolls to keep field visible
    ↓
Bottom navigation remains accessible
    ↓
User can still tap [Next] button
```

### Touch Interactions
```
All buttons: 48px minimum height
    ↓
Comfortable thumb reach
    ↓
Bottom navigation in natural thumb zone
    ↓
Large input fields
    ↓
Clear tap targets
```

## 🎨 Visual States

### Button States
```
[Next Button]
- Default: Blue (#3b82f6)
- Disabled: Gray (#d1d5db), opacity 0.6
- Loading: Shows ActivityIndicator
- Pressed: Slightly darker (system default)

[Back Button]
- Default: Light gray (#f3f4f6)
- Pressed: Darker gray

[Save Draft Button]
- Default: White with border
- Pressed: Light gray background
```

### Progress Indicator States
```
Dot States:
• Completed: Green (#10b981) - circle
• Active: Blue (#3b82f6) - elongated
• Upcoming: Gray (#e5e7eb) - circle

Progress Bar:
- Animated width based on step
- Blue fill (#3b82f6)
- Gray background (#e5e7eb)
```

## 🔐 Security & Privacy

```
User Authentication Check
    ↓
┌─────────────────┐
│ Must be logged  │
│ in to save/     │
│ publish         │
└─────────────────┘
    ↓
Creator ID attached to listing
    ↓
Database RLS policies enforced
    ↓
User can only edit own listings
```

---

This visual guide complements the technical documentation and helps understand the flow at a glance.
