"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminService } from "@/lib/admin"
import type { User } from "@/lib/auth"
import { Search, Edit, Trash2, UserPlus, Filter } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "player">("all")

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await adminService.getUsers()
        setUsers(data)
      } catch (error) {
        console.error("Failed to load users:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(id)
        setUsers(users.filter((user) => user.id !== id))
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">User Management</h1>
          <p className="font-body text-slate-600">Manage all registered users and their permissions.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as "all" | "admin" | "player")}
                className="border border-slate-200 rounded-md px-3 py-2 font-body text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="player">Players</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="font-heading text-left py-3 px-4">User</th>
                  <th className="font-heading text-left py-3 px-4">Role</th>
                  <th className="font-heading text-left py-3 px-4">City</th>
                  <th className="font-heading text-left py-3 px-4">Points</th>
                  <th className="font-heading text-left py-3 px-4">Member Since</th>
                  <th className="font-heading text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-body font-semibold">{user.name}</div>
                        <div className="font-body text-sm text-slate-600">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-body text-slate-600">{user.city}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-body font-semibold text-primary">{user.points || "N/A"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-body text-slate-600">
                        {new Date(user.memberSince).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
