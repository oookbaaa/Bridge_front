// Real authentication system connecting to backend API

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface License {
  id: string;
  licenseNumber: string; // Format: 20241234 - Generated when user subscribes
  status: 'active' | 'expired' | 'suspended';
  issueDate: string;
  expiryDate?: string;
  issuingAuthority: string; // "Tunisian Bridge Federation"
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: { title: 'Admin' | 'Player' };
  city: string;
  cin: number;
  equipeNationale: boolean;
  genre: 'Homme' | 'Femme';
  disipline?: string;
  passportNumber?: string;
  phone: string;
  dateOfBirth: string;
  birthPlace?: string;
  studyLevel?: string;
  club?: string;
  adresse: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  license?: License;
  roleId: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  accessToken?: string;
  error?: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  city: string;
  cin: number;
  genre: 'Homme' | 'Femme';
  phone: string;
  dateOfBirth: string;
  adresse: string;
  // Optional fields
  disipline?: string;
  passportNumber?: string;
  birthPlace?: string;
  studyLevel?: string;
  club?: string;
  equipeNationale?: boolean;
  // License number - if provided, user gets automatic access
  licenseNumber?: string;
}

export const authService = {
  // Real login function
  async login(
    loginIdentifier: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginIdentifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Login failed',
        };
      }

      const data = await response.json();

      // Store token and user in localStorage
      if (data.accessToken) {
        localStorage.setItem('ftb_token', data.accessToken);
      }

      const user = this.transformUser(data.user);
      localStorage.setItem('ftb_user', JSON.stringify(user));

      return { success: true, user, accessToken: data.accessToken };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  },

  // Real register function
  async register(registerData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Registration failed',
        };
      }

      const data = await response.json();

      // Store token and user in localStorage
      if (data.accessToken) {
        localStorage.setItem('ftb_token', data.accessToken);
      }

      const user = this.transformUser(data.user);
      localStorage.setItem('ftb_user', JSON.stringify(user));

      return { success: true, user, accessToken: data.accessToken };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.',
      };
    }
  },

  // Get current user profile from backend
  async getCurrentProfile(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Token might be expired, clear it
        this.logout();
        return null;
      }

      const userData = await response.json();
      const user = this.transformUser(userData);
      localStorage.setItem('ftb_user', JSON.stringify(user));

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('ftb_user');
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);

      // Check if token exists
      const token = this.getToken();
      if (!token) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      return null;
    }
  },

  // Get stored token
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ftb_token');
  },

  
  // Transform backend user data to frontend format
  transformUser(backendUser: any): User {
    return {
      id: backendUser.id,
      firstName: backendUser.firstName,
      lastName: backendUser.lastName,
      email: backendUser.email,
      role: backendUser.role,
      city: backendUser.city,
      cin: backendUser.cin,
      equipeNationale: backendUser.equipeNationale || false,
      genre: backendUser.genre,
      disipline: backendUser.disipline,
      passportNumber: backendUser.passportNumber,
      phone: backendUser.phone,
      dateOfBirth: backendUser.dateOfBirth,
      birthPlace: backendUser.birthPlace,
      studyLevel: backendUser.studyLevel,
      club: backendUser.club,
      adresse: backendUser.adresse,
      isActive: backendUser.isActive,
      createdAt: backendUser.createdAt,
      updatedAt: backendUser.updatedAt,
      license: backendUser.license,
      roleId: backendUser.roleId,
    };
  },

  // Logout function
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ftb_user');
      localStorage.removeItem('ftb_token');
    }
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  },

  // Get authorization headers for API calls
  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },
};
