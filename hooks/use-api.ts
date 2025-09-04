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

// License verification hook
export interface LicenseVerificationData {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LicenseVerificationResponse {
  isValid: boolean;
  message: string;
  licenseData?: {
    licenseNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    governorate: string;
    phone: string;
    dateOfBirth: string;
  };
}

export const useVerifyLicense = () => {
  return useMutation<
    LicenseVerificationResponse,
    Error,
    LicenseVerificationData
  >({
    mutationFn: async (verificationData) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-license`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'License verification failed');
      }

      return data;
    },
  });
};

// File Upload Hook
export const useFileUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const token = authService.getToken();
      if (!token) throw new Error('Not authenticated');

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
      }

      return response.json();
    },
  });
};
