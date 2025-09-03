import { useMutation, useQuery } from '@tanstack/react-query';
import {
  authService,
  type RegisterData,
  type AuthResponse,
  type User,
} from '@/lib/auth';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Authentication Hooks
export const useLogin = () => {
  return useMutation<AuthResponse, Error, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      return authService.login(email, password);
    },
  });
};

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: async (registerData) => {
      return authService.register(registerData);
    },
  });
};

export const useProfile = () => {
  return useQuery<User | null>({
    queryKey: ['profile'],
    queryFn: () => authService.getCurrentProfile(),
    enabled: !!authService.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCheckSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => authService.checkSubscription(),
    enabled: !!authService.getToken(),
  });
};

// Data Import Hooks (for admin)
export const useImportExcelData = () => {
  return useMutation({
    mutationFn: async () => {
      const token = authService.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(
        `${API_BASE_URL}/data-import/players/existing-file`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Import failed');
      }

      return response.json();
    },
  });
};

// License validation hook
export const useValidateLicense = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (licenseNumber: string) => {
      // This would be a registration attempt to check if license exists
      const testData = {
        firstName: 'Test',
        lastName: 'Validation',
        email: `validate-${Date.now()}@test.com`,
        password: 'TempPassword123!',
        city: 'Tunis',
        cin: 12345678,
        genre: 'Homme' as const,
        phone: '+216 12 345 678',
        dateOfBirth: '1990-01-01',
        adresse: 'Test Address',
        licenseNumber,
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (response.status === 404) {
        throw new Error('License not found');
      } else if (response.status === 409) {
        throw new Error('License already in use');
      } else if (!response.ok) {
        throw new Error(data.message || 'Validation failed');
      }

      return { valid: true, data };
    },
  });
};

// Subscription hooks
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const token = authService.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/subscription/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription plans');
      }

      return response.json();
    },
    enabled: !!authService.getToken(),
  });
};

export const useRenewSubscription = () => {
  return useMutation({
    mutationFn: async ({ planId }: { planId: string }) => {
      const token = authService.getToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/subscription/renew`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Renewal failed');
      }

      return response.json();
    },
  });
};

