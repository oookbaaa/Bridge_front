"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ("Admin" | "Player")[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="animate-pulse bg-slate-200 rounded h-8 w-32"></div>
  }

  if (!user || !allowedRoles.includes(user.role.title)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
