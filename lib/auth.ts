// Mock authentication system - can be replaced with real backend later

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "player"
  city?: string
  memberSince: string
  points?: number
}

// Mock user database
const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Ben Salem",
    email: "ahmed@example.com",
    role: "admin",
    city: "Tunis",
    memberSince: "2020-01-15",
    points: 2450,
  },
  {
    id: "2",
    name: "Fatima Khelifi",
    email: "fatima@example.com",
    role: "player",
    city: "Sfax",
    memberSince: "2021-03-20",
    points: 2380,
  },
]

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export const authService = {
  // Mock login function
  async login(email: string, password: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // Mock password validation (in real app, this would be handled by backend)
    if (password.length < 6) {
      return { success: false, error: "Invalid password" }
    }

    // Store user in localStorage
    localStorage.setItem("tbf_user", JSON.stringify(user))

    return { success: true, user }
  },

  // Mock register function
  async register(name: string, email: string, password: string, city: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return { success: false, error: "User already exists" }
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: "player",
      city,
      memberSince: new Date().toISOString().split("T")[0],
      points: 1000, // Starting points
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Store user in localStorage
    localStorage.setItem("tbf_user", JSON.stringify(newUser))

    return { success: true, user: newUser }
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("tbf_user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  // Logout function
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tbf_user")
    }
  },
}
