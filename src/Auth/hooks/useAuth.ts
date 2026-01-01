import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import type { LoginCredentials, SignupCredentials } from "../types/auth";
import { useAuthStore } from "./useAuthStore";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    setLoading,
    logout: clearAuth,
  } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: (credentials: SignupCredentials) => authApi.signup(credentials),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
    },
  });

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,

    // Actions
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,

    // Mutation states
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    isLoginPending: loginMutation.isPending,
    isSignupPending: signupMutation.isPending,
  };
};
