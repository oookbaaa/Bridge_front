import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, BookOpen, Globe } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    {
      year: '1985',
      title: 'Federation Founded',
      description:
        'Tunisian Bridge Federation established to promote bridge across the country.',
    },
    {
      year: '1992',
      title: 'First National Championship',
      description:
        'Inaugural national tournament with 64 participants from across Tunisia.',
    },
    {
      year: '1998',
      title: 'International Recognition',
      description:
        'Joined the World Bridge Federation and African Bridge Federation.',
    },
    {
      year: '2005',
      title: 'Youth Program Launch',
      description:
        'Started dedicated programs to introduce bridge to young players.',
    },
    {
      year: '2012',
      title: 'Digital Transformation',
      description:
        'Launched online platform for tournaments and player management.',
    },
    {
      year: '2020',
      title: 'Virtual Tournaments',
      description:
        'Successfully adapted to online tournaments during global challenges.',
    },
    {
      year: '2024',
      title: 'Modern Era',
      description:
        'Continuing to grow with 500+ active members and expanding programs.',
    },
  ];

  const stats = [
    { icon: Users, label: 'Membres actifs', value: '500+' },
    { icon: Trophy, label: 'Tournois annuels', value: '25+' },
    { icon: BookOpen, label: 'Programmes de formation', value: '12' },
    { icon: Globe, label: 'Villes couvertes', value: '15' },
  ];

  const boardMembers = [
    {
      name: 'Dr. Mahmoud Khalil',
      position: 'Président',
      bio: "Maître de bridge avec 30+ années d'expérience, champion national.",
    },
    {
      name: 'Amina Bouazizi',
      position: 'Vice-présidente',
      bio: 'Directrice de tournois internationaux et instructrice certifiée de bridge.',
    },
    {
      name: 'Tarek Mansouri',
      position: 'Secrétaire général',
      bio: 'Organisateur de tournois et coordinateur de programmes de jeunesse.',
    },
    {
      name: 'Leila Trabelsi',
      position: 'Trésorière',
      bio: 'Expert financier et passionné de bridge depuis longtemps.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            Notre héritage
          </h1>
          <p className="font-body text-xl text-slate-600 max-w-2xl mx-auto">
            Une tradition d'excellence - Fondée sur les principes de stratégie
            et de communauté, nous promouvons l'art du bridge en Tunisie.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-cyan-50 to-white border-l-4 border-l-accent">
            <CardContent className="p-8">
              <h2 className="font-heading text-2xl font-bold text-primary mb-4">
                Notre mission
              </h2>
              <p className="font-body text-lg text-slate-700 leading-relaxed">
                La Tunisian Bridge Federation est dédiée à promouvoir le jeu de
                bridge en Tunisie en organisant des tournois, en fournissant une
                éducation, en favorisant la communauté, et en représentant nos
                joueurs sur la scène internationale. Nous croyons que le bridge
                est plus qu'un jeu de cartes—c'est un sport mental qui construit
                la pensée stratégique, les connexions sociales, et les amitiés à
                vie.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            Notre impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="font-body text-slate-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            Notre parcours
          </h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-accent/30"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-3 h-3 bg-accent rounded-full border-4 border-white shadow-md z-10"></div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                    }`}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge
                            variant="outline"
                            className="text-accent border-accent"
                          >
                            {milestone.year}
                          </Badge>
                        </div>
                        <CardTitle className="font-heading text-lg">
                          {milestone.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-body text-slate-600">
                          {milestone.description}
                        </p>
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
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            Équipe de direction
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {boardMembers.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-lg">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {member.name}
                  </CardTitle>
                  <p className="font-body text-accent font-semibold">
                    {member.position}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="font-body text-slate-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-8 text-center">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  Nous nous efforçons de maintenir les plus hauts standards dans
                  l'organisation de tournois, le développement des joueurs, et
                  le service à la communauté.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">
                  Inclusivité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  Le bridge est pour tout le monde. Nous accueillons des joueurs
                  de tous horizons, âges, et niveaux de compétence pour
                  rejoindre notre communauté.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-primary">
                  Intégrité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-body text-slate-600">
                  Le fair play, le comportement éthique, et le respect de tous
                  les participants sont les fondations de notre organisation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-slate-50 rounded-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-primary mb-4">
            Rejoignez notre communauté
          </h3>
          <p className="font-body text-slate-600 mb-6 max-w-2xl mx-auto">
            Que vous soyez un débutant cherchant à apprendre ou un joueur
            expérimenté cherchant la compétition, il y a un endroit pour vous
            dans la Tunisian Bridge Federation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-md font-body transition-colors">
              Devenir membre
            </button>
            <button className="border border-primary text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-md font-body transition-colors">
              Contactez-nous
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
