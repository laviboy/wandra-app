import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers = new Map<
  string,
  { email: string; password: string; name: string }
>();

export const authApi = {
  /**
   * Mock login API call
   * Simulates authentication with 1 second delay
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await delay(1000);

    const user = mockUsers.get(credentials.email);

    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password");
    }

    return {
      user: {
        id: Math.random().toString(36).substring(7),
        email: user.email,
        name: user.name,
        createdAt: new Date().toISOString(),
      },
      token: `mock_token_${Date.now()}`,
    };
  },

  /**
   * Mock signup API call
   * Simulates user registration with 1 second delay
   */
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    await delay(1000);

    if (mockUsers.has(credentials.email)) {
      throw new Error("Email already exists");
    }

    // Store new user
    mockUsers.set(credentials.email, {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
    });

    return {
      user: {
        id: Math.random().toString(36).substring(7),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
      },
      token: `mock_token_${Date.now()}`,
    };
  },

  /**
   * Mock logout API call
   */
  logout: async (): Promise<void> => {
    await delay(500);
    // In a real app, this would invalidate the token
  },
};
