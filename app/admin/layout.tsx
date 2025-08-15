"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/login">
      <div className="min-h-screen bg-slate-50 flex">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  )
}
