import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Star } from 'lucide-react';

export default function HomePage() {
  const latestNews = [
    {
      title: 'National Championship 2024 Registration Open',
      date: 'March 15, 2024',
      excerpt:
        "Join Tunisia's premier bridge tournament. Early bird registration ends April 1st.",
      category: 'Tournament',
    },
    {
      title: 'New Bridge Learning Program Launched',
      date: 'March 10, 2024',
      excerpt:
        'Beginner-friendly courses starting this month in Tunis and Sfax.',
      category: 'Education',
    },
    {
      title: 'International Bridge Festival Success',
      date: 'March 5, 2024',
      excerpt:
        'Over 200 players participated in our annual international event.',
      category: 'Event',
    },
  ];

  const features = [
    {
      icon: Trophy,
      title: 'Competitive Tournaments',
      description:
        'Regular tournaments for all skill levels, from beginners to masters.',
    },
    {
      icon: Users,
      title: 'Strong Community',
      description: 'Connect with fellow bridge enthusiasts across Tunisia.',
    },
    {
      icon: Star,
      title: 'Expert Training',
      description: 'Learn from certified instructors and improve your game.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 to-white py-20">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-6">
                Bienvenue à la Fédération tunisienne de bridge
              </h1>
              <p className="font-body text-xl text-slate-600 mb-8 leading-relaxed">
                Où la stratégie rencontre la communauté. Rejoignez la fédération
                tunisienne de bridge et connectez-vous avec share your passion
                for this timeless card game.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  Rejoindre notre communauté
                </Button>
                <Button variant="outline" size="lg">
                  Voir les événements à venir
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/bridge-players-strategic.png"
                alt="Bridge players in action"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-primary mb-4">
              Why Choose FTB?
            </h2>
            <p className="font-body text-lg text-slate-600 max-w-2xl mx-auto">
              Rejoignez notre famille de passionnés de bridge
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="font-heading text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-4">
                Dernières actualités
              </h2>
              <p className="font-body text-lg text-slate-600">
                Restez informé sur les tournois et événements à venir!
              </p>
            </div>
            <Button variant="outline">Voir toutes les actualités</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestNews.map((news, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{news.category}</Badge>
                    <span className="font-body text-sm text-slate-500">
                      {news.date}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {news.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-slate-600">{news.excerpt}</p>
                  <Button variant="link" className="p-0 mt-2 text-accent">
                    En savoir plus →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">
            Prêt à rejoindre l'action?
          </h2>
          <p className="font-body text-xl text-primary-foreground/80 mb-8">
            Devenez partie de la plus active communauté de bridge en Tunisie
            aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              S'inscrire maintenant
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
