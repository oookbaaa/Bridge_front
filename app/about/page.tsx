import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, BookOpen, Globe } from "lucide-react"

export default function AboutPage() {
  const milestones = [
    {
      year: "1985",
      title: "Federation Founded",
      description: "Tunisian Bridge Federation established to promote bridge across the country.",
    },
    {
      year: "1992",
      title: "First National Championship",
      description: "Inaugural national tournament with 64 participants from across Tunisia.",
    },
    {
      year: "1998",
      title: "International Recognition",
      description: "Joined the World Bridge Federation and African Bridge Federation.",
    },
    {
      year: "2005",
      title: "Youth Program Launch",
      description: "Started dedicated programs to introduce bridge to young players.",
    },
    {
      year: "2012",
      title: "Digital Transformation",
      description: "Launched online platform for tournaments and player management.",
    },
    {
      year: "2020",
      title: "Virtual Tournaments",
      description: "Successfully adapted to online tournaments during global challenges.",
    },
    {
      year: "2024",
      title: "Modern Era",
      description: "Continuing to grow with 500+ active members and expanding programs.",
    },
  ]

  const stats = [
    { icon: Users, label: "Active Members", value: "500+" },
    { icon: Trophy, label: "Annual Tournaments", value: "25+" },
    { icon: BookOpen, label: "Training Programs", value: "12" },
    { icon: Globe, label: "Cities Covered", value: "15" },
  ]

  const boardMembers = [
    {
      name: "Dr. Mahmoud Khalil",
      position: "President",
      bio: "Bridge master with 30+ years experience, former national champion.",
    },
    {
      name: "Amina Bouazizi",
      position: "Vice President",
      bio: "International tournament director and certified bridge instructor.",
    },
    {
      name: "Tarek Mansouri",
      position: "Secretary General",
      bio: "Tournament organizer and youth program coordinator.",
    },
    {
      name: "Leila Trabelsi",
      position: "Treasurer",
      bio: "Financial expert and long-time bridge enthusiast.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Our Legacy</h1>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">
            A Tradition of Excellence - Founded on principles of strategy and community, we promote the art of bridge
            across Tunisia.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-cyan-50 to-white border-l-4 border-l-accent">
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">Our Mission</h2>
              <p className="font-body text-lg text-slate-700 leading-relaxed">
                The Tunisian Bridge Federation is dedicated to promoting the game of bridge throughout Tunisia by
                organizing tournaments, providing education, fostering community, and representing our players on the
                international stage. We believe bridge is more than a card game—it's a mental sport that builds
                strategic thinking, social connections, and lifelong friendships.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="font-body text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-accent/30"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-accent rounded-full border-4 border-white shadow-md z-10"></div>

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-accent border-accent">
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="font-heading text-lg">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-slate-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Board Members */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-lg">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg">{member.name}</CardTitle>
                  <p className="font-body text-accent font-semibold">{member.position}</p>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-slate-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  We strive for the highest standards in tournament organization, player development, and community
                  service.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">Inclusivity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  Bridge is for everyone. We welcome players of all backgrounds, ages, and skill levels to join our
                  community.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  Fair play, ethical conduct, and respect for all participants are the foundations of our organization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-slate-50 rounded-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-primary mb-4">Join Our Community</h3>
          <p className="font-body text-slate-600 mb-6 max-w-2xl mx-auto">
            Whether you're a beginner looking to learn or an experienced player seeking competition, there's a place for
            you in the Tunisian Bridge Federation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-body transition-colors">
              Become a Member
            </button>
            <button className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md font-body transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
