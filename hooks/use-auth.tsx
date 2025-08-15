"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService, type User, type AuthResponse } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (name: string, email: string, password: string, city: string) => Promise<AuthResponse>
  logout: () => void
  hasRole: (role: "admin" | "player") => boolean
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing user on mount
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true)
    const response = await authService.login(email, password)

    if (response.success && response.user) {
      setUser(response.user)
    }

    setLoading(false)
    return response
  }

  const register = async (name: string, email: string, password: string, city: string): Promise<AuthResponse> => {
    setLoading(true)
    const response = await authService.register(name, email, password, city)

    if (response.success && response.user) {
      setUser(response.user)
    }

    setLoading(false)
    return response
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const hasRole = (role: "admin" | "player"): boolean => {
    return user?.role === role
  }

  const isAuthenticated = (): boolean => {
    return user !== null
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
