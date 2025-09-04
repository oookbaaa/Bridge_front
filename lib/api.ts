// Real API service connecting to backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  usersByRole: Array<{ role: string; count: string }>;
  recentRegistrations: number;
}

export interface UserFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  fileType: string;
  documentType: string;
  fileSize: number;
  mimeType: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  emailVerified: boolean;
  license?: {
    id: string;
    licenseNumber: string;
    status: 'active' | 'expired' | 'suspended';
    issueDate: string;
    expiryDate?: string;
    issuingAuthority: string;
  };
  files?: UserFile[];
  roleId: string;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ftb_token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // User Management
  async getUsers(status?: string, role?: string): Promise<ApiResponse<User[]>> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (role) params.append('role', role);

    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return this.request<User[]>(endpoint);
  }

  async getPendingUsers(): Promise<ApiResponse<User[]>> {
    return this.request<User[]>('/users/pending-approval');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async approveUser(id: string, notes?: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  }

  async rejectUser(
    id: string,
    reason: string,
    notes?: string
  ): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason, notes }),
    });
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    return this.request<UserStats>('/users/stats/overview');
  }

  // Tournament Management (placeholder for future implementation)
  async getTournaments(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/tournaments');
  }

  async createTournament(tournament: any): Promise<ApiResponse<any>> {
    return this.request('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournament),
    });
  }

  async updateTournament(id: string, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTournament(id: string): Promise<ApiResponse<any>> {
    return this.request(`/tournaments/${id}`, {
      method: 'DELETE',
    });
  }

  // News Management (placeholder for future implementation)
  async getNews(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/news');
  }

  async createNews(news: any): Promise<ApiResponse<any>> {
    return this.request('/news', {
      method: 'POST',
      body: JSON.stringify(news),
    });
  }

  async updateNews(id: string, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteNews(id: string): Promise<ApiResponse<any>> {
    return this.request(`/news/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
