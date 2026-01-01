# Supabase Authentication Integration

This guide explains how the Supabase authentication is integrated into the Wandra app.

## Setup Overview

The app now uses Supabase for authentication instead of the mock API. The integration includes:

- ✅ User sign up with email and password
- ✅ User login with email and password
- ✅ Automatic session persistence
- ✅ Auth state management with Zustand
- ✅ Logout functionality
- ✅ Auto-refresh tokens

## File Structure

```
src/
└── Auth/
    ├── api/
    │   └── authApi.ts          # Supabase auth API calls
    ├── hooks/
    │   ├── useAuth.ts          # Auth mutations (login, signup, logout)
    │   └── useAuthStore.ts     # Auth state management with session persistence
    ├── navigation/
    │   └── AuthStack.tsx       # Auth navigation stack
    ├── screens/
    │   ├── LoginScreen.tsx     # Login UI
    │   └── SignupScreen.tsx    # Signup UI
    └── types/
        └── auth.ts             # Auth type definitions
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Client

The Supabase client is configured in `utils/supabase.ts` with:

- Local storage for session persistence (using expo-sqlite)
- Auto token refresh
- Session persistence enabled

## How It Works

### 1. Initial Authentication Check

When the app starts, `RootNavigator` calls `useAuthStore.initialize()` which:

1. Checks for an existing session in local storage
2. Restores the user session if valid
3. Sets up a listener for auth state changes
4. Shows a loading screen while checking

### 2. Login Flow

```typescript
// User enters email and password
login({ email, password })
  ↓
// authApi.login() calls Supabase
supabase.auth.signInWithPassword()
  ↓
// Returns user and session
{ user, session }
  ↓
// useAuth updates the store
setUser(user)
setToken(session.access_token)
  ↓
// RootNavigator redirects to BottomTabs
```

### 3. Signup Flow

```typescript
// User enters email, password, and name
signup({ email, password, name })
  ↓
// authApi.signup() calls Supabase
supabase.auth.signUp({
  email,
  password,
  options: { data: { name } }
})
  ↓
// Returns user and session
{ user, session }
  ↓
// useAuth updates the store
setUser(user)
setToken(session.access_token)
  ↓
// RootNavigator redirects to BottomTabs
```

### 4. Logout Flow

```typescript
// User clicks logout button
logout()
  ↓
// authApi.logout() calls Supabase
supabase.auth.signOut()
  ↓
// useAuth clears the store
setUser(null)
setToken(null)
  ↓
// RootNavigator redirects to AuthStack
```

### 5. Session Persistence

The app automatically persists sessions using:

- `expo-sqlite/localStorage` for storage
- Supabase's `persistSession: true` option
- Auth state listener for automatic updates

When the user closes and reopens the app:
1. `initialize()` checks for a stored session
2. If valid, restores the user without requiring login
3. If expired or invalid, shows the login screen

## Usage Examples

### Login

```typescript
import { useAuth } from "@/src/Auth/hooks/useAuth";

const { login, isLoginPending } = useAuth();

const handleLogin = () => {
  login(
    { email: "user@example.com", password: "password123" },
    {
      onSuccess: () => {
        console.log("Login successful!");
      },
      onError: (error) => {
        Alert.alert("Login Failed", error.message);
      },
    }
  );
};
```

### Signup

```typescript
import { useAuth } from "@/src/Auth/hooks/useAuth";

const { signup, isSignupPending } = useAuth();

const handleSignup = () => {
  signup(
    {
      email: "user@example.com",
      password: "password123",
      name: "John Doe",
    },
    {
      onSuccess: () => {
        console.log("Signup successful!");
      },
      onError: (error) => {
        Alert.alert("Signup Failed", error.message);
      },
    }
  );
};
```

### Logout

```typescript
import { useAuth } from "@/src/Auth/hooks/useAuth";

const { logout } = useAuth();

const handleLogout = () => {
  logout();
};
```

### Access Current User

```typescript
import { useAuthStore } from "@/src/Auth/hooks/useAuthStore";

const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// Use in your components
{user && <Text>Welcome, {user.name}!</Text>}
```

## Supabase Setup

### Required Supabase Configuration

1. **Enable Email Authentication** in your Supabase project:
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates if needed

2. **Optional: Disable Email Confirmation** (for development):
   - Go to Authentication → Settings
   - Disable "Enable email confirmations"
   - **Note**: Enable this in production for security

3. **User Metadata**:
   - The app stores the user's name in `user_metadata.name`
   - This is automatically set during signup

## Testing

### Test Accounts

You can create test accounts through the signup screen or directly in Supabase:

1. Go to your Supabase project → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Add metadata: `{"name": "Test User"}`

### Testing the Flow

1. **Sign up**: Create a new account with email, password, and name
2. **Log out**: Click the logout button in the Profile screen
3. **Log in**: Sign in with the credentials you created
4. **Close app**: Close and reopen the app to test session persistence

## Troubleshooting

### Session Not Persisting

- Make sure `expo-sqlite` is properly installed
- Check that `localStorage` is available
- Verify Supabase config has `persistSession: true`

### "Invalid email or password" Error

- Check that the email exists in Supabase
- Verify the password is correct
- Check if email confirmation is required

### Auth State Not Updating

- Verify `useAuthStore.initialize()` is called in RootNavigator
- Check that `onAuthStateChange` listener is set up
- Look for errors in the console

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** for Supabase credentials
3. **Enable email confirmation** in production
4. **Implement password reset** flow (coming soon)
5. **Add rate limiting** for login attempts (Supabase handles this)

## Next Steps

Potential improvements:

- [ ] Add forgot password flow
- [ ] Add email verification UI
- [ ] Add social auth (Google, Apple, etc.)
- [ ] Add biometric authentication
- [ ] Add 2FA support
- [ ] Add profile update functionality
- [ ] Add user avatar upload

## API Reference

### authApi

```typescript
// Login
authApi.login(credentials: LoginCredentials): Promise<AuthResponse>

// Signup
authApi.signup(credentials: SignupCredentials): Promise<AuthResponse>

// Logout
authApi.logout(): Promise<void>

// Get current session
authApi.getSession(): Promise<Session | null>

// Get current user
authApi.getCurrentUser(): Promise<User | null>
```

### useAuth Hook

```typescript
const {
  // User data
  user,
  isAuthenticated,
  isLoading,

  // Login
  login,
  isLoginPending,

  // Signup
  signup,
  isSignupPending,

  // Logout
  logout,
  isLogoutPending,
} = useAuth();
```

### useAuthStore

```typescript
const {
  user,              // Current user
  isAuthenticated,   // Auth status
  isLoading,         // Loading state
  token,             // Access token
  isInitialized,     // Initialization status
  setUser,           // Set user manually
  setToken,          // Set token manually
  setLoading,        // Set loading state
  logout,            // Clear auth state
  initialize,        // Initialize auth from storage
} = useAuthStore();
```
