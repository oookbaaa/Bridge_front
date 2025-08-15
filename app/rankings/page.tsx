import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

export default function RankingsPage() {
  const topPlayers = [
    { rank: 1, name: "Ahmed Ben Salem", points: 2450, city: "Tunis", category: "Master" },
    { rank: 2, name: "Fatima Khelifi", points: 2380, city: "Sfax", category: "Master" },
    { rank: 3, name: "Mohamed Trabelsi", points: 2320, city: "Sousse", category: "Master" },
    { rank: 4, name: "Leila Mansouri", points: 2280, city: "Tunis", category: "Expert" },
    { rank: 5, name: "Karim Bouazizi", points: 2250, city: "Monastir", category: "Expert" },
    { rank: 6, name: "Nadia Gharbi", points: 2220, city: "Tunis", category: "Expert" },
    { rank: 7, name: "Sami Jebali", points: 2180, city: "Bizerte", category: "Expert" },
    { rank: 8, name: "Rim Sassi", points: 2150, city: "Sfax", category: "Expert" },
    { rank: 9, name: "Youssef Hamdi", points: 2120, city: "Gabes", category: "Advanced" },
    { rank: 10, name: "Maryam Zouari", points: 2090, city: "Tunis", category: "Advanced" },
  ]

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />
    return <span className="font-bold text-slate-600">#{rank}</span>
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Master":
        return "bg-purple-100 text-purple-800"
      case "Expert":
        return "bg-blue-100 text-blue-800"
      case "Advanced":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Current Rankings</h1>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">
            Celebrate Our Champions - Discover the top players shaping the Tunisian bridge scene. Compete, connect, and
            climb the ranks!
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {topPlayers.slice(0, 3).map((player, index) => (
            <Card
              key={player.rank}
              className={`text-center ${index === 0 ? "md:order-2 transform md:scale-105" : index === 1 ? "md:order-1" : "md:order-3"} hover:shadow-lg transition-all`}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-2">{getRankIcon(player.rank)}</div>
                <CardTitle className="font-heading text-xl">{player.name}</CardTitle>
                <p className="font-body text-slate-600">{player.city}</p>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">{player.points}</div>
                <Badge className={getCategoryColor(player.category)}>{player.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Rankings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Complete Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="font-heading text-left py-3 px-4">Rank</th>
                    <th className="font-heading text-left py-3 px-4">Player</th>
                    <th className="font-heading text-left py-3 px-4">City</th>
                    <th className="font-heading text-left py-3 px-4">Points</th>
                    <th className="font-heading text-left py-3 px-4">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {topPlayers.map((player) => (
                    <tr key={player.rank} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center">{getRankIcon(player.rank)}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-body font-semibold">{player.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-body text-slate-600">{player.city}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-body font-bold text-primary">{player.points}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getCategoryColor(player.category)}>{player.category}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Ranking Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">How Rankings Work</CardTitle>
            </CardHeader>
            <CardContent className="font-body text-slate-600 space-y-2">
              <p>• Rankings are updated monthly based on tournament performance</p>
              <p>• Points are awarded based on tournament level and placement</p>
              <p>• Categories: Beginner (0-1500), Advanced (1500-2000), Expert (2000-2300), Master (2300+)</p>
              <p>• Inactive players (no tournaments in 12 months) are not ranked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Next Ranking Update</CardTitle>
            </CardHeader>
            <CardContent className="font-body text-slate-600">
              <p className="mb-4">
                The next ranking update will be on <strong>April 1, 2024</strong>
              </p>
              <p>Rankings will include results from:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Spring Regional Championship</li>
                <li>Tunis Open Tournament</li>
                <li>Weekly club tournaments</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
