// Real admin service - handles all admin operations

import type { User } from '@/lib/auth';
import { apiService, type UserStats, type User as ApiUser } from '@/lib/api';

export interface Tournament {
  id: string;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  category:
    | 'Championship'
    | 'Tournament'
    | 'Education'
    | 'International'
    | 'Youth'
    | 'Invitational';
  registrationOpen: boolean;
  description: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  category: 'Tournament' | 'Education' | 'Event' | 'Announcement';
  published: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalTournaments: number;
  activeTournaments: number;
  totalNews: number;
  recentRegistrations: number;
  monthlyGrowth: number;
  pendingApprovals: number;
  activeUsers: number;
}

// Mock data
const mockTournaments: Tournament[] = [
  {
    id: '1',
    title: 'National Championship 2024',
    date: '2024-04-15',
    location: 'Hotel Laico, Tunis',
    maxParticipants: 200,
    currentParticipants: 150,
    status: 'upcoming',
    category: 'Championship',
    registrationOpen: true,
    description:
      "Tunisia's premier bridge tournament featuring the country's top players.",
  },
  {
    id: '2',
    title: "Beginner's Workshop",
    date: '2024-03-25',
    location: 'FTB Headquarters, Tunis',
    maxParticipants: 30,
    currentParticipants: 25,
    status: 'upcoming',
    category: 'Education',
    registrationOpen: true,
    description: 'Learn the basics of bridge in this comprehensive workshop.',
  },
  {
    id: '3',
    title: 'Winter Championship 2023',
    date: '2023-12-15',
    location: 'Sousse Marina',
    maxParticipants: 100,
    currentParticipants: 95,
    status: 'completed',
    category: 'Championship',
    registrationOpen: false,
    description: 'Completed winter championship with great success.',
  },
];

const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'National Championship 2024 Registration Open',
    content:
      'We are excited to announce that registration for the National Championship 2024 is now open...',
    excerpt:
      "Join Tunisia's premier bridge tournament. Early bird registration ends April 1st.",
    author: 'Admin',
    publishDate: '2024-03-15',
    category: 'Tournament',
    published: true,
  },
  {
    id: '2',
    title: 'New Bridge Learning Program Launched',
    content:
      'Our new comprehensive learning program is designed for beginners...',
    excerpt: 'Beginner-friendly courses starting this month in Tunis and Sfax.',
    author: 'Admin',
    publishDate: '2024-03-10',
    category: 'Education',
    published: true,
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Ahmed',
    lastName: 'Ben Salem',
    email: 'ahmed@example.com',
    role: { title: 'Admin' },
    city: 'Tunis',
    cin: 11111111,
    equipeNationale: false,
    genre: 'Homme',
    phone: '+216 98 123 456',
    dateOfBirth: '1985-01-15',
    adresse: 'Tunis, Tunisie',
    isActive: true,
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2020-01-15T00:00:00Z',
    emailVerified: true,
    roleId: 'admin-role-id',
  },
  {
    id: '2',
    firstName: 'Fatima',
    lastName: 'Khelifi',
    email: 'fatima@example.com',
    role: { title: 'Player' },
    city: 'Sfax',
    cin: 22222222,
    equipeNationale: false,
    genre: 'Femme',
    phone: '+216 98 234 567',
    dateOfBirth: '1990-03-20',
    adresse: 'Sfax, Tunisie',
    isActive: true,
    createdAt: '2021-03-20T00:00:00Z',
    updatedAt: '2021-03-20T00:00:00Z',
    emailVerified: true,
    roleId: 'player-role-id',
  },
  {
    id: '3',
    firstName: 'Mohamed',
    lastName: 'Trabelsi',
    email: 'mohamed@example.com',
    role: { title: 'Player' },
    city: 'Sousse',
    cin: 12345678,
    equipeNationale: false,
    genre: 'Homme',
    phone: '+216 98 345 678',
    dateOfBirth: '1988-05-10',
    adresse: 'Sousse, Tunisie',
    isActive: true,
    createdAt: '2022-01-10T00:00:00Z',
    updatedAt: '2022-01-10T00:00:00Z',
    emailVerified: true,
    roleId: 'player-role-id',
  },
  {
    id: '4',
    firstName: 'Sara',
    lastName: 'Ben Ali',
    email: 'sara@example.com',
    role: { title: 'Player' },
    city: 'Monastir',
    cin: 87654321,
    equipeNationale: false,
    genre: 'Femme',
    phone: '+216 98 456 789',
    dateOfBirth: '1995-07-15',
    adresse: 'Monastir, Tunisie',
    isActive: false,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    emailVerified: false,
    roleId: 'player-role-id',
  },
  {
    id: '5',
    firstName: 'Youssef',
    lastName: 'Khelil',
    email: 'youssef@example.com',
    role: { title: 'Player' },
    city: 'Bizerte',
    cin: 11223344,
    equipeNationale: false,
    genre: 'Homme',
    phone: '+216 98 567 890',
    dateOfBirth: '1992-09-25',
    adresse: 'Bizerte, Tunisie',
    isActive: false,
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    emailVerified: false,
    roleId: 'player-role-id',
  },
];

export const adminService = {
  // Statistics
  async getStats(): Promise<AdminStats> {
    try {
      const response = await apiService.getUserStats();
      if (response.success && response.data) {
        return {
          totalUsers: response.data.totalUsers,
          activeUsers: response.data.activeUsers,
          pendingApprovals: response.data.pendingUsers,
          recentRegistrations: response.data.recentRegistrations,
          monthlyGrowth: 8.5, // TODO: Calculate from real data
          totalTournaments: 0, // TODO: Implement tournament stats
          activeTournaments: 0, // TODO: Implement tournament stats
          totalNews: 0, // TODO: Implement news stats
        };
      }
      throw new Error(response.error || 'Failed to fetch stats');
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Return fallback data
      return {
        totalUsers: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        recentRegistrations: 0,
        monthlyGrowth: 0,
        totalTournaments: 0,
        activeTournaments: 0,
        totalNews: 0,
      };
    }
  },

  // User Management
  async getUsers(status?: string, role?: string): Promise<User[]> {
    try {
      const response = await apiService.getUsers(status, role);
      if (response.success && response.data) {
        // Convert ApiUser to User type
        return response.data.map(
          (apiUser: ApiUser): User => ({
            ...apiUser,
            // Ensure role title matches expected type
            role: { title: apiUser.role.title as 'Admin' | 'Player' },
          })
        );
      }
      throw new Error(response.error || 'Failed to fetch users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    try {
      // TODO: Implement update user API endpoint
      console.log('Update user not implemented yet:', id, updates);
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await apiService.deleteUser(id);
      return response.success;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // User Approval Management
  async getPendingUsers(): Promise<User[]> {
    try {
      const response = await apiService.getPendingUsers();
      if (response.success && response.data) {
        // Convert ApiUser to User type
        return response.data.map(
          (apiUser: ApiUser): User => ({
            ...apiUser,
            // Ensure role title matches expected type
            role: { title: apiUser.role.title as 'Admin' | 'Player' },
          })
        );
      }
      throw new Error(response.error || 'Failed to fetch pending users');
    } catch (error) {
      console.error('Error fetching pending users:', error);
      return [];
    }
  },

  async approveUser(id: string, notes?: string): Promise<boolean> {
    try {
      const response = await apiService.approveUser(id, notes);
      return response.success;
    } catch (error) {
      console.error('Error approving user:', error);
      return false;
    }
  },

  async rejectUser(
    id: string,
    reason: string,
    notes?: string
  ): Promise<boolean> {
    try {
      const response = await apiService.rejectUser(id, reason, notes);
      return response.success;
    } catch (error) {
      console.error('Error rejecting user:', error);
      return false;
    }
  },

  // Tournament Management
  async getTournaments(): Promise<Tournament[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockTournaments];
  },

  async createTournament(
    tournament: Omit<Tournament, 'id' | 'currentParticipants'>
  ): Promise<Tournament> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTournament: Tournament = {
      ...tournament,
      id: Date.now().toString(),
      currentParticipants: 0,
    };
    mockTournaments.push(newTournament);
    return newTournament;
  },

  async updateTournament(
    id: string,
    updates: Partial<Tournament>
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const tournamentIndex = mockTournaments.findIndex((t) => t.id === id);
    if (tournamentIndex !== -1) {
      mockTournaments[tournamentIndex] = {
        ...mockTournaments[tournamentIndex],
        ...updates,
      };
      return true;
    }
    return false;
  },

  async deleteTournament(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const tournamentIndex = mockTournaments.findIndex((t) => t.id === id);
    if (tournamentIndex !== -1) {
      mockTournaments.splice(tournamentIndex, 1);
      return true;
    }
    return false;
  },

  // News Management
  async getNews(): Promise<NewsArticle[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...mockNews];
  },

  async createNews(news: Omit<NewsArticle, 'id'>): Promise<NewsArticle> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newNews: NewsArticle = {
      ...news,
      id: Date.now().toString(),
    };
    mockNews.push(newNews);
    return newNews;
  },

  async updateNews(
    id: string,
    updates: Partial<NewsArticle>
  ): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newsIndex = mockNews.findIndex((n) => n.id === id);
    if (newsIndex !== -1) {
      mockNews[newsIndex] = { ...mockNews[newsIndex], ...updates };
      return true;
    }
    return false;
  },

  async deleteNews(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newsIndex = mockNews.findIndex((n) => n.id === id);
    if (newsIndex !== -1) {
      mockNews.splice(newsIndex, 1);
      return true;
    }
    return false;
  },
};
