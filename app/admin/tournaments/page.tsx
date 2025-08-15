"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminService, type Tournament } from "@/lib/admin"
import { Search, Edit, Trash2, Plus, Calendar, MapPin, Users } from "lucide-react"

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await adminService.getTournaments()
        setTournaments(data)
      } catch (error) {
        console.error("Failed to load tournaments:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  const handleDeleteTournament = async (id: string) => {
    if (confirm("Are you sure you want to delete this tournament?")) {
      try {
        await adminService.deleteTournament(id)
        setTournaments(tournaments.filter((tournament) => tournament.id !== id))
      } catch (error) {
        console.error("Failed to delete tournament:", error)
      }
    }
  }

  const filteredTournaments = tournaments.filter(
    (tournament) =>
      tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: Tournament["category"]) => {
    switch (category) {
      case "Championship":
        return "bg-purple-100 text-purple-800"
      case "International":
        return "bg-red-100 text-red-800"
      case "Tournament":
        return "bg-blue-100 text-blue-800"
      case "Education":
        return "bg-green-100 text-green-800"
      case "Youth":
        return "bg-orange-100 text-orange-800"
      case "Invitational":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">Tournament Management</h1>
          <p className="font-body text-slate-600">Create and manage all tournaments and events.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tournaments by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTournaments.map((tournament) => (
          <Card key={tournament.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                  <Badge className={getCategoryColor(tournament.category)}>{tournament.category}</Badge>
                  <Badge className={getStatusColor(tournament.status)}>{tournament.status}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTournament(tournament.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardTitle className="font-heading text-lg">{tournament.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-body text-slate-600 text-sm">{tournament.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="font-body">{new Date(tournament.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span className="font-body">{tournament.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-accent" />
                  <span className="font-body">
                    {tournament.currentParticipants}/{tournament.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${tournament.registrationOpen ? "bg-green-500" : "bg-red-500"}`}
                  ></div>
                  <span className="font-body text-xs">
                    {tournament.registrationOpen ? "Registration Open" : "Registration Closed"}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all"
                    style={{
                      width: `${(tournament.currentParticipants / tournament.maxParticipants) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="font-body text-xs text-slate-600 mt-1">
                  {Math.round((tournament.currentParticipants / tournament.maxParticipants) * 100)}% full
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-heading text-lg font-semibold text-slate-600 mb-2">No tournaments found</h3>
            <p className="font-body text-slate-500">
              {searchTerm ? "Try adjusting your search terms." : "Create your first tournament to get started."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
