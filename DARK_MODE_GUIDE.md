# Dark Mode Implementation Guide

## Overview

The app now has centralized dark mode support with:
- ✅ Status bar that adapts to light/dark mode
- ✅ Navigation theme that adapts automatically
- ✅ Extended color palette in the theme system
- ✅ Utility hook for accessing theme colors

## What's Been Fixed

### 1. Status Bar Configuration
- **App.tsx** and **app/_layout.tsx**: Status bar now shows dark text on light backgrounds and light text on dark backgrounds
- **ListingDetailScreen**: Removed hardcoded `barStyle="light-content"` to respect global settings

### 2. Navigation Theme
- **RootNavigator.tsx**: Now uses React Navigation's `DarkTheme` and `DefaultTheme` based on device color scheme
- **BottomTabs.tsx**: Tab bar background adapts to dark/light mode

### 3. Enhanced Theme System
- **constants/theme.ts**: Added more semantic colors including:
  - `textSecondary`, `backgroundSecondary`, `backgroundTertiary`
  - `border`, `card`, `primary`, `error`, `success`, `warning`
  - Each color has light and dark variants

### 4. New Utility Hook
- **hooks/use-theme-colors.ts**: Easy access to theme colors

## How to Update Your Screens

### Using the Theme Hook

Replace hardcoded colors with theme colors:

```tsx
import { useThemeColors } from '@/hooks/use-theme-colors';

const MyScreen = () => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Hello</Text>
    </View>
  );
};
```

### Color Mapping Reference

Replace these hardcoded values:

| Old Value | Theme Property | Light | Dark |
|-----------|---------------|-------|------|
| `#fff` | `colors.background` | #fff | #151718 |
| `#F9FAFB` | `colors.backgroundSecondary` | #F9FAFB | #1f2937 |
| `#F3F4F6` | `colors.backgroundTertiary` | #F3F4F6 | #374151 |
| `#111827` | `colors.text` | #11181C | #ECEDEE |
| `#6b7280` | `colors.textSecondary` | #6b7280 | #9ca3af |
| `#e5e7eb` | `colors.border` | #e5e7eb | #374151 |
| `#3b82f6` | `colors.primary` | #3b82f6 | #60a5fa |

### Example: Converting a Screen

**Before:**
```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#111827',
  },
});
```

**After:**
```tsx
const MyScreen = () => {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
    },
  });

  return <View style={styles.container}>...</View>;
};
```

## Testing

1. **iOS Simulator**: Settings → Appearance → Toggle between Light/Dark
2. **Android Emulator**: Settings → Display → Dark theme
3. **Physical Device**: System Settings → Display & Brightness

## Current Status

✅ **Fixed:**
- Status bar visibility in both modes
- Navigation theme
- Bottom tabs appearance

⚠️ **Needs Update:**
- Individual screen backgrounds and text colors
- Component cards and buttons
- Input fields and forms

## Next Steps

To fully support dark mode, you should:

1. Update high-priority screens first (Home, Profile, Search)
2. Replace hardcoded colors with theme colors
3. Test each screen in both light and dark mode
4. Consider using dynamic styles or `useMemo` for performance

## Questions?

The status bar should now be visible in both modes. The navigation and tabs will adapt automatically. Individual screens may still have light-colored elements in dark mode until they're updated to use the theme system.
