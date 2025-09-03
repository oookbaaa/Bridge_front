'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  authService,
  type User,
  type AuthResponse,
  type RegisterData,
} from '@/lib/auth';
import { useLogin, useRegister, useProfile } from './use-api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (loginIdentifier: string, password: string) => Promise<AuthResponse>;
  register: (registerData: RegisterData) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: 'Admin' | 'Player') => boolean;
  isAuthenticated: () => boolean;
  checkSubscription: () => Promise<any>;
  getDisplayName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { data: profileData, isLoading: profileLoading } = useProfile();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Update user when profile data changes
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
    }
  }, [profileData]);

  const initializeAuth = async () => {
    setLoading(true);

    // Check for existing user in localStorage
    const currentUser = authService.getCurrentUser();

    if (currentUser && authService.getToken()) {
      setUser(currentUser);
      // Profile query will automatically fetch fresh data if token exists
    } else {
      setUser(null);
    }

    setLoading(false);
  };

  const login = async (
    loginIdentifier: string,
    password: string
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      const response = await loginMutation.mutateAsync({
        email: loginIdentifier,
        password,
      });

      if (response.success && response.user) {
        setUser(response.user);
        // Invalidate queries to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
      }

      setLoading(false);
      return response;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Login failed',
      };
    }
  };

  const register = async (
    registerData: RegisterData
  ): Promise<AuthResponse> => {
    setLoading(true);

    try {
      const response = await registerMutation.mutateAsync(registerData);

      if (response.success && response.user) {
        setUser(response.user);
        // Invalidate queries to fetch fresh data
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
      }

      setLoading(false);
      return response;
    } catch (error: any) {
      setLoading(false);
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    // Clear all cached queries
    queryClient.clear();
  };

  const refreshUser = async () => {
    if (authService.getToken()) {
      // Invalidate profile query to force refresh
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      const freshProfile = await authService.getCurrentProfile();
      if (freshProfile) {
        setUser(freshProfile);
      } else {
        // Token might be expired
        logout();
      }
    }
  };

  const hasRole = (role: 'Admin' | 'Player'): boolean => {
    return user?.role?.title === role;
  };

  const isAuthenticated = (): boolean => {
    return user !== null && authService.getToken() !== null;
  };

  const checkSubscription = async () => {
    return await authService.checkSubscription();
  };

  const getDisplayName = (): string => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  // Show loading if either auth is loading or profile is loading
  const isLoading = loading || profileLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        login,
        register,
        logout,
        refreshUser,
        hasRole,
        isAuthenticated,
        checkSubscription,
        getDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
