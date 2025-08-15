'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/use-auth';
import {
  playerService,
  type PlayerStats,
  type TournamentHistory,
  type Achievement,
  type UpcomingTournament,
} from '@/lib/player';
import {
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  Star,
} from 'lucide-react';

export default function PlayerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [tournamentHistory, setTournamentHistory] = useState<
    TournamentHistory[]
  >([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState<
    UpcomingTournament[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        const [statsData, historyData, achievementsData, upcomingData] =
          await Promise.all([
            playerService.getPlayerStats(user.id),
            playerService.getTournamentHistory(user.id),
            playerService.getAchievements(user.id),
            playerService.getUpcomingTournaments(user.id),
          ]);

        setStats(statsData);
        setTournamentHistory(historyData);
        setAchievements(achievementsData);
        setUpcomingTournaments(upcomingData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleTournamentRegistration = async (
    tournamentId: string,
    isRegistered: boolean
  ) => {
    if (!user) return;

    try {
      if (isRegistered) {
        await playerService.unregisterFromTournament(user.id, tournamentId);
      } else {
        await playerService.registerForTournament(user.id, tournamentId);
      }

      // Refresh upcoming tournaments
      const updatedTournaments = await playerService.getUpcomingTournaments(
        user.id
      );
      setUpcomingTournaments(updatedTournaments);
    } catch (error) {
      console.error('Failed to update tournament registration:', error);
    }
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'epic':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'rare':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'common':
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlacementColor = (placement: number, total: number) => {
    const percentage = (placement / total) * 100;
    if (percentage <= 10) return 'text-yellow-600'; // Top 10%
    if (percentage <= 25) return 'text-green-600'; // Top 25%
    if (percentage <= 50) return 'text-blue-600'; // Top 50%
    return 'text-slate-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary mb-2">
            Bienvenue de retour, {user?.name}!
          </h1>
          <p className="font-body text-slate-600">
            Voici votre vue d'ensemble de la route du bridge et les opportunités
            à venir.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">
                    Classement actuel
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    #{stats?.currentRank}{' '}
                    <span className="text-sm font-normal">
                      / {stats?.totalPlayers}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">
                    Total de points
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {user?.points}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">
                    Taux de victoire
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {stats?.winRate}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">
                    Tournois
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {stats?.totalTournaments}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Tournaments */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Tournois à venir
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-heading font-semibold text-primary">
                          {tournament.title}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(tournament.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {tournament.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {tournament.currentParticipants}/
                            {tournament.maxParticipants}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          tournament.isRegistered ? 'default' : 'outline'
                        }
                      >
                        {tournament.isRegistered ? 'Inscrit' : 'Disponible'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>
                            Date limite d'inscription:{' '}
                            {new Date(
                              tournament.registrationDeadline
                            ).toLocaleDateString()}
                          </span>
                          <span>
                            {Math.round(
                              (tournament.currentParticipants /
                                tournament.maxParticipants) *
                                100
                            )}
                            % full
                          </span>
                        </div>
                        <Progress
                          value={
                            (tournament.currentParticipants /
                              tournament.maxParticipants) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant={
                          tournament.isRegistered ? 'outline' : 'default'
                        }
                        onClick={() =>
                          handleTournamentRegistration(
                            tournament.id,
                            tournament.isRegistered
                          )
                        }
                        className={
                          tournament.isRegistered
                            ? 'text-red-600 hover:text-red-700'
                            : 'bg-accent hover:bg-accent/90'
                        }
                      >
                        {tournament.isRegistered
                          ? 'Se désinscrire'
                          : "S'inscrire"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tournament History */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Historique des tournois récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tournamentHistory.slice(0, 5).map((tournament) => (
                    <div
                      key={tournament.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-body font-semibold text-primary">
                          {tournament.tournamentName}
                        </h4>
                        <p className="font-body text-sm text-slate-600">
                          {new Date(tournament.date).toLocaleDateString()} •{' '}
                          {tournament.totalParticipants} players
                        </p>
                      </div>
                      <div className="text-right">
                        {tournament.status === 'completed' ? (
                          <>
                            <div
                              className={`font-body font-bold ${getPlacementColor(
                                tournament.placement,
                                tournament.totalParticipants
                              )}`}
                            >
                              #{tournament.placement}
                            </div>
                            <div className="font-body text-sm text-accent">
                              +{tournament.pointsEarned} pts
                            </div>
                          </>
                        ) : (
                          <Badge variant="outline">À venir</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-primary">
                    {user?.name}
                  </h3>
                  <p className="font-body text-slate-600">{user?.city}</p>
                  <p className="font-body text-sm text-slate-500">
                    Membre depuis{' '}
                    {new Date(user?.memberSince || '').getFullYear()}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-heading text-lg font-bold text-primary">
                        {stats?.wins}
                      </div>
                      <div className="font-body text-xs text-slate-600">
                        Victoires
                      </div>
                    </div>
                    <div>
                      <div className="font-heading text-lg font-bold text-primary">
                        {stats?.averageScore}%
                      </div>
                      <div className="font-body text-xs text-slate-600">
                        Score moyen
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Réalisations récentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getRarityColor(
                        achievement.rarity
                      )}`}
                    >
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-body font-semibold text-primary text-sm">
                        {achievement.title}
                      </h4>
                      <p className="font-body text-xs text-slate-600">
                        {achievement.description}
                      </p>
                      <p className="font-body text-xs text-slate-500">
                        {new Date(achievement.dateEarned).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                  <a href="/events">Parcourir les tournois</a>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <a href="/rankings">Voir les classements</a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Mettre à jour le profil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
