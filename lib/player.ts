export interface PlayerStats {
  totalTournaments: number
  wins: number
  winRate: number
  currentRank: number
  totalPlayers: number
  pointsThisMonth: number
  averageScore: number
}

export interface TournamentHistory {
  id: string
  tournamentName: string
  date: string
  placement: number
  totalParticipants: number
  pointsEarned: number
  status: "completed" | "upcoming" | "ongoing"
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  dateEarned: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UpcomingTournament {
  id: string
  title: string
  date: string
  location: string
  category: string
  registrationDeadline: string
  isRegistered: boolean
  maxParticipants: number
  currentParticipants: number
}

// Mock data
const mockPlayerStats: PlayerStats = {
  totalTournaments: 15,
  wins: 3,
  winRate: 20,
  currentRank: 4,
  totalPlayers: 500,
  pointsThisMonth: 180,
  averageScore: 65.5,
}

const mockTournamentHistory: TournamentHistory[] = [
  {
    id: "1",
    tournamentName: "Winter Championship 2023",
    date: "2023-12-15",
    placement: 3,
    totalParticipants: 95,
    pointsEarned: 150,
    status: "completed",
  },
  {
    id: "2",
    tournamentName: "Autumn Regional 2023",
    date: "2023-10-20",
    placement: 8,
    totalParticipants: 64,
    pointsEarned: 80,
    status: "completed",
  },
  {
    id: "3",
    tournamentName: "Summer Open 2023",
    date: "2023-07-10",
    placement: 1,
    totalParticipants: 48,
    pointsEarned: 200,
    status: "completed",
  },
  {
    id: "4",
    tournamentName: "National Championship 2024",
    date: "2024-04-15",
    placement: 0,
    totalParticipants: 200,
    pointsEarned: 0,
    status: "upcoming",
  },
]

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Victory",
    description: "Won your first tournament",
    icon: "🏆",
    dateEarned: "2023-07-10",
    rarity: "epic",
  },
  {
    id: "2",
    title: "Consistent Player",
    description: "Participated in 10+ tournaments",
    icon: "🎯",
    dateEarned: "2023-11-15",
    rarity: "rare",
  },
  {
    id: "3",
    title: "Top 10 Finish",
    description: "Finished in top 10 of a major tournament",
    icon: "⭐",
    dateEarned: "2023-10-20",
    rarity: "common",
  },
  {
    id: "4",
    title: "Rising Star",
    description: "Gained 500+ points in a single month",
    icon: "🌟",
    dateEarned: "2023-08-01",
    rarity: "rare",
  },
]

const mockUpcomingTournaments: UpcomingTournament[] = [
  {
    id: "1",
    title: "National Championship 2024",
    date: "2024-04-15",
    location: "Hotel Laico, Tunis",
    category: "Championship",
    registrationDeadline: "2024-04-01",
    isRegistered: true,
    maxParticipants: 200,
    currentParticipants: 150,
  },
  {
    id: "2",
    title: "Sfax Regional Tournament",
    date: "2024-04-08",
    location: "Cultural Center, Sfax",
    category: "Tournament",
    registrationDeadline: "2024-03-30",
    isRegistered: false,
    maxParticipants: 80,
    currentParticipants: 65,
  },
  {
    id: "3",
    title: "International Bridge Festival",
    date: "2024-05-20",
    location: "Hammamet Resort",
    category: "International",
    registrationDeadline: "2024-05-01",
    isRegistered: false,
    maxParticipants: 200,
    currentParticipants: 120,
  },
]

export const playerService = {
  // Get player statistics
  async getPlayerStats(userId: string): Promise<PlayerStats> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockPlayerStats
  },

  // Get tournament history
  async getTournamentHistory(userId: string): Promise<TournamentHistory[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockTournamentHistory]
  },

  // Get achievements
  async getAchievements(userId: string): Promise<Achievement[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockAchievements]
  },

  // Get upcoming tournaments
  async getUpcomingTournaments(userId: string): Promise<UpcomingTournament[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return [...mockUpcomingTournaments]
  },

  // Register for tournament
  async registerForTournament(userId: string, tournamentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const tournament = mockUpcomingTournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      tournament.isRegistered = true
      tournament.currentParticipants += 1
      return true
    }
    return false
  },

  // Unregister from tournament
  async unregisterFromTournament(userId: string, tournamentId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const tournament = mockUpcomingTournaments.find((t) => t.id === tournamentId)
    if (tournament) {
      tournament.isRegistered = false
      tournament.currentParticipants -= 1
      return true
    }
    return false
  },
}
