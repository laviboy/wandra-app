# Wandra App - Modular Auth + Bottom Tab Navigation

## 🎯 Implementation Complete

This app implements a clean, modular authentication system with React Navigation bottom tabs.

## 📁 Project Structure

```
src/
├── api/              # API services
│   └── authApi.ts    # Mock login/signup endpoints
├── hooks/            # Business logic
│   ├── useAuth.ts    # Auth operations (login/signup/logout)
│   └── useAuthStore.ts  # Zustand global state
├── screens/          # Pure UI components
│   ├── LoginScreen.tsx
│   ├── SignupScreen.tsx
│   ├── HomeScreen.tsx
│   ├── SearchScreen.tsx
│   ├── AddScreen.tsx
│   ├── ProfileScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/       # Navigation setup
│   ├── AuthStack.tsx       # Login/Signup stack
│   ├── BottomTabs.tsx      # Main app tabs
│   └── RootNavigator.tsx   # Conditional root
└── types/            # TypeScript definitions
    ├── auth.ts       # User, AuthState, etc.
    └── navigation.ts # All navigation types
```

## 🚀 How to Run

```bash
npm start
```

## ✅ Features Implemented

### Authentication Flow
- ✅ Login screen with email/password
- ✅ Signup screen with name/email/password
- ✅ Mock API with validation
- ✅ React Query for API state management
- ✅ Zustand for global auth state
- ✅ Error handling with alerts

### Navigation
- ✅ Conditional rendering (Auth vs App)
- ✅ Bottom tabs with 5 tabs
- ✅ Each tab has nested stack navigator
- ✅ Profile screen with logout functionality

### Architecture
- ✅ **Screens**: Pure UI components only
- ✅ **Hooks**: All business logic
- ✅ **API**: Centralized API calls
- ✅ **Types**: Full TypeScript support

## 🔑 Test the Auth Flow

1. Start the app
2. You'll see the Login screen
3. Click "Sign Up" to create an account
4. Enter name, email, password (min 6 chars)
5. After signup, you'll be logged in automatically
6. Navigate between tabs (Home, Search, Add, Profile, Settings)
7. Go to Profile tab and click "Logout"
8. You'll be redirected back to Login

## 🧩 Stack Details

- **React Navigation**: Native Stack + Bottom Tabs
- **Zustand**: Global state management
- **React Query**: API state & caching
- **TypeScript**: Full type safety
- **Mock API**: Simulated backend with delays

## 📝 Code Principles

### ✅ DO
- Keep screens as pure UI components
- Put all logic in `hooks/`
- Use TypeScript types from `types/`
- Make API calls from `api/`

### ❌ DON'T
- Add functions in screen files
- Mix UI and logic
- Make API calls directly from screens
- Hardcode navigation types

## 🔄 Extensibility

### Adding New Auth Screens
Add to `AuthStack.tsx` and update `AuthStackParamList`:
```typescript
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
```

### Adding New Tab Screens
1. Create screen in `src/screens/`
2. Add stack in `BottomTabs.tsx`
3. Update types in `types/navigation.ts`

### Connecting Real API
Replace mock functions in `api/authApi.ts` with real HTTP calls.

## 🎨 Customization

- Tab icons: Add icons in `BottomTabs.tsx` tabBarIcon
- Styling: Use NativeWind or styled-components
- Theme: Add theme provider in `_layout.tsx`
