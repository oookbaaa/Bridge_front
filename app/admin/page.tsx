"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adminService, type AdminStats } from "@/lib/admin"
import { Users, Calendar, FileText, TrendingUp, UserPlus, Activity } from "lucide-react"

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to load stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Tournaments",
      value: stats?.totalTournaments || 0,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Tournaments",
      value: stats?.activeTournaments || 0,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "News Articles",
      value: stats?.totalNews || 0,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Recent Registrations",
      value: stats?.recentRegistrations || 0,
      icon: UserPlus,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Monthly Growth",
      value: `${stats?.monthlyGrowth || 0}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="font-body text-slate-600">Welcome back! Here's what's happening with TBF.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">Create Tournament</div>
                <div className="font-body text-sm text-slate-600">Add a new tournament</div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">Add News</div>
                <div className="font-body text-sm text-slate-600">Publish news article</div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">Manage Users</div>
                <div className="font-body text-sm text-slate-600">View all users</div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">View Analytics</div>
                <div className="font-body text-sm text-slate-600">Check performance</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">New user registered</p>
                  <p className="font-body text-xs text-slate-600">Leila Mansouri joined from Tunis</p>
                </div>
                <span className="font-body text-xs text-slate-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">Tournament updated</p>
                  <p className="font-body text-xs text-slate-600">National Championship details modified</p>
                </div>
                <span className="font-body text-xs text-slate-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">News published</p>
                  <p className="font-body text-xs text-slate-600">Bridge Learning Program announcement</p>
                </div>
                <span className="font-body text-xs text-slate-500">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
