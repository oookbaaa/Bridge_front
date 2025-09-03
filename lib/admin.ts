// Mock admin service - handles all admin operations

import type { User } from "@/lib/auth"

export interface Tournament {
  id: string
  title: string
  date: string
  location: string
  maxParticipants: number
  currentParticipants: number
  status: "upcoming" | "ongoing" | "completed"
  category: "Championship" | "Tournament" | "Education" | "International" | "Youth" | "Invitational"
  registrationOpen: boolean
  description: string
}

export interface NewsArticle {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishDate: string
  category: "Tournament" | "Education" | "Event" | "Announcement"
  published: boolean
}

export interface AdminStats {
  totalUsers: number
  totalTournaments: number
  activeTournaments: number
  totalNews: number
  recentRegistrations: number
  monthlyGrowth: number
}

// Mock data
const mockTournaments: Tournament[] = [
  {
    id: "1",
    title: "National Championship 2024",
    date: "2024-04-15",
    location: "Hotel Laico, Tunis",
    maxParticipants: 200,
    currentParticipants: 150,
    status: "upcoming",
    category: "Championship",
    registrationOpen: true,
    description: "Tunisia's premier bridge tournament featuring the country's top players.",
  },
  {
    id: "2",
    title: "Beginner's Workshop",
    date: "2024-03-25",
    location: "FTB Headquarters, Tunis",
    maxParticipants: 30,
    currentParticipants: 25,
    status: "upcoming",
    category: "Education",
    registrationOpen: true,
    description: "Learn the basics of bridge in this comprehensive workshop.",
  },
  {
    id: "3",
    title: "Winter Championship 2023",
    date: "2023-12-15",
    location: "Sousse Marina",
    maxParticipants: 100,
    currentParticipants: 95,
    status: "completed",
    category: "Championship",
    registrationOpen: false,
    description: "Completed winter championship with great success.",
  },
]

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "National Championship 2024 Registration Open",
    content: "We are excited to announce that registration for the National Championship 2024 is now open...",
    excerpt: "Join Tunisia's premier bridge tournament. Early bird registration ends April 1st.",
    author: "Admin",
    publishDate: "2024-03-15",
    category: "Tournament",
    published: true,
  },
  {
    id: "2",
    title: "New Bridge Learning Program Launched",
    content: "Our new comprehensive learning program is designed for beginners...",
    excerpt: "Beginner-friendly courses starting this month in Tunis and Sfax.",
    author: "Admin",
    publishDate: "2024-03-10",
    category: "Education",
    published: true,
  },
]

const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Ahmed",
    lastName: "Ben Salem",
    email: "ahmed@example.com",
    role: { title: "Admin" },
    city: "Tunis",
    memberSince: "2020-01-15",
    points: 2450,
  },
  {
    id: "2",
    firstName: "Fatima",
    lastName: "Khelifi",
    email: "fatima@example.com",
    role: { title: "Player" },
    city: "Sfax",
    memberSince: "2021-03-20",
    points: 2380,
  },
  {
    id: "3",
    firstName: "Mohamed",
    lastName: "Trabelsi",
    email: "mohamed@example.com",
    role: { title: "Player" },
    city: "Sousse",
    cin: 12345678,
    points: 2320,
  },
]

export const adminService = {
  // Statistics
  async getStats(): Promise<AdminStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      totalUsers: mockUsers.length,
      totalTournaments: mockTournaments.length,
      activeTournaments: mockTournaments.filter((t) => t.status === "upcoming" || t.status === "ongoing").length,
      totalNews: mockNews.length,
      recentRegistrations: 12,
      monthlyGrowth: 8.5,
    }
  },

  // User Management
  async getUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockUsers]
  },

  async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
      return true
    }
    return false
  },

  async deleteUser(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const userIndex = mockUsers.findIndex((u) => u.id === id)
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1)
      return true
    }
    return false
  },

  // Tournament Management
  async getTournaments(): Promise<Tournament[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockTournaments]
  },

  async createTournament(tournament: Omit<Tournament, "id" | "currentParticipants">): Promise<Tournament> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newTournament: Tournament = {
      ...tournament,
      id: Date.now().toString(),
      currentParticipants: 0,
    }
    mockTournaments.push(newTournament)
    return newTournament
  },

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const tournamentIndex = mockTournaments.findIndex((t) => t.id === id)
    if (tournamentIndex !== -1) {
      mockTournaments[tournamentIndex] = { ...mockTournaments[tournamentIndex], ...updates }
      return true
    }
    return false
  },

  async deleteTournament(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const tournamentIndex = mockTournaments.findIndex((t) => t.id === id)
    if (tournamentIndex !== -1) {
      mockTournaments.splice(tournamentIndex, 1)
      return true
    }
    return false
  },

  // News Management
  async getNews(): Promise<NewsArticle[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockNews]
  },

  async createNews(news: Omit<NewsArticle, "id">): Promise<NewsArticle> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newNews: NewsArticle = {
      ...news,
      id: Date.now().toString(),
    }
    mockNews.push(newNews)
    return newNews
  },

  async updateNews(id: string, updates: Partial<NewsArticle>): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newsIndex = mockNews.findIndex((n) => n.id === id)
    if (newsIndex !== -1) {
      mockNews[newsIndex] = { ...mockNews[newsIndex], ...updates }
      return true
    }
    return false
  },

  async deleteNews(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newsIndex = mockNews.findIndex((n) => n.id === id)
    if (newsIndex !== -1) {
      mockNews.splice(newsIndex, 1)
      return true
    }
    return false
  },
}
