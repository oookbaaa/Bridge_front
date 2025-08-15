"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAuth={true} fallbackPath="/login">
      <div className="min-h-screen bg-slate-50">{children}</div>
    </ProtectedRoute>
  )
}
