import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "National Championship 2024",
      date: "April 15-17, 2024",
      time: "9:00 AM - 6:00 PM",
      location: "Hotel Laico, Tunis",
      participants: "150+ players",
      category: "Championship",
      description:
        "Tunisia's premier bridge tournament featuring the country's top players competing for the national title.",
      registrationOpen: true,
      featured: true,
    },
    {
      id: 2,
      title: "Beginner's Workshop",
      date: "March 25, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "TBF Headquarters, Tunis",
      participants: "30 spots",
      category: "Education",
      description: "Learn the basics of bridge in this comprehensive workshop designed for newcomers to the game.",
      registrationOpen: true,
      featured: false,
    },
    {
      id: 3,
      title: "Sfax Regional Tournament",
      date: "April 8, 2024",
      time: "10:00 AM - 7:00 PM",
      location: "Cultural Center, Sfax",
      participants: "80 players",
      category: "Tournament",
      description:
        "Regional competition open to all skill levels with separate divisions for different experience levels.",
      registrationOpen: true,
      featured: false,
    },
    {
      id: 4,
      title: "International Bridge Festival",
      date: "May 20-22, 2024",
      time: "All Day",
      location: "Hammamet Resort",
      participants: "200+ players",
      category: "International",
      description: "Annual international event featuring players from across North Africa and Europe.",
      registrationOpen: false,
      featured: true,
    },
    {
      id: 5,
      title: "Youth Bridge Camp",
      date: "June 10-14, 2024",
      time: "9:00 AM - 4:00 PM",
      location: "Sidi Bou Said",
      participants: "40 youth",
      category: "Youth",
      description: "Five-day intensive camp for young players aged 12-18 to develop their bridge skills.",
      registrationOpen: false,
      featured: false,
    },
    {
      id: 6,
      title: "Masters Invitational",
      date: "July 5-7, 2024",
      time: "10:00 AM - 8:00 PM",
      location: "Sousse Marina",
      participants: "64 masters",
      category: "Invitational",
      description: "Exclusive tournament for master-level players by invitation only.",
      registrationOpen: false,
      featured: false,
    },
  ]

  const getCategoryColor = (category: string) => {
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

  const featuredEvents = upcomingEvents.filter((event) => event.featured)
  const regularEvents = upcomingEvents.filter((event) => !event.featured)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Upcoming Events</h1>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">
            Join the Action - Don't miss out on the excitement! Check our schedule and participate in tournaments across
            Tunisia.
          </p>
        </div>

        {/* Featured Events */}
        <div className="mb-12">
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    {event.registrationOpen && (
                      <Badge variant="outline" className="text-accent border-accent">
                        Registration Open
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-body text-slate-600">{event.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span className="font-body">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span className="font-body">{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span className="font-body">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span className="font-body">{event.participants}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className={event.registrationOpen ? "bg-accent hover:bg-accent/90" : ""}
                      disabled={!event.registrationOpen}
                    >
                      {event.registrationOpen ? "Register Now" : "Registration Closed"}
                    </Button>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Events */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary mb-6">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regularEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    {event.registrationOpen && (
                      <Badge variant="outline" className="text-accent border-accent text-xs">
                        Open
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading text-lg">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="font-body text-slate-600 text-sm line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3 text-accent" />
                      <span className="font-body">{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-3 w-3 text-accent" />
                      <span className="font-body">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-accent" />
                      <span className="font-body">{event.participants}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className={`w-full ${event.registrationOpen ? "bg-accent hover:bg-accent/90" : ""}`}
                    disabled={!event.registrationOpen}
                  >
                    {event.registrationOpen ? "Register" : "Registration Closed"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Event Calendar CTA */}
        <div className="mt-16 text-center bg-slate-50 rounded-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-primary mb-4">Want to Stay Updated?</h3>
          <p className="font-body text-slate-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our event calendar and never miss a tournament or workshop. Get notifications about
            registration openings and event updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Subscribe to Calendar
            </Button>
            <Button variant="outline" size="lg">
              Download Event Guide
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
