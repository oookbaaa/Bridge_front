'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService, type AdminStats } from '@/lib/admin';
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  UserPlus,
  Activity,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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
    );
  }

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Tournois',
      value: stats?.totalTournaments || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tournois actifs',
      value: stats?.activeTournaments || 0,
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Actualités',
      value: stats?.totalNews || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Inscriptions récentes',
      value: stats?.recentRegistrations || 0,
      icon: UserPlus,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      title: 'Croissance mensuelle',
      value: `${stats?.monthlyGrowth || 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-primary mb-2">
          Tableau de bord administrateur
        </h1>
        <p className="font-body text-slate-600">
          Bienvenue! Voici ce qui se passe avec TBF.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-slate-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                >
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
            <CardTitle className="font-heading">Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">
                  Créer un tournoi
                </div>
                <div className="font-body text-sm text-slate-600">
                  Ajouter un nouveau tournoi
                </div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">
                  Ajouter une actualité
                </div>
                <div className="font-body text-sm text-slate-600">
                  Publier une actualité
                </div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">
                  Gérer les utilisateurs
                </div>
                <div className="font-body text-sm text-slate-600">
                  Voir tous les utilisateurs
                </div>
              </button>
              <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
                <div className="font-body font-semibold text-primary mb-1">
                  Voir les statistiques
                </div>
                <div className="font-body text-sm text-slate-600">
                  Voir les performances
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Activités récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">
                    Nouvel utilisateur enregistré
                  </p>
                  <p className="font-body text-xs text-slate-600">
                    Leila Mansouri s'est inscrite depuis Tunis
                  </p>
                </div>
                <span className="font-body text-xs text-slate-500">2h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">
                    Tournoi mis à jour
                  </p>
                  <p className="font-body text-xs text-slate-600">
                    Détails du championnat national modifiés
                  </p>
                </div>
                <span className="font-body text-xs text-slate-500">4h ago</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-body text-sm font-semibold">
                    Actualité publiée
                  </p>
                  <p className="font-body text-xs text-slate-600">
                    Annonce du programme d'apprentissage de bridge
                  </p>
                </div>
                <span className="font-body text-xs text-slate-500">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
