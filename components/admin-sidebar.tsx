'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  Home,
  Clock,
} from 'lucide-react';

const navigation = [
  { name: 'Accueil', href: '/admin', icon: LayoutDashboard },
  { name: 'Approbations', href: '/admin/approvals', icon: Clock },
  { name: 'Utilisateurs', href: '/admin/users', icon: Users },
  { name: 'Tournois', href: '/admin/tournaments', icon: Calendar },
  { name: 'Actualités', href: '/admin/news', icon: FileText },
  { name: 'Statistiques', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Tunisian Bridge Federation"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-heading font-bold text-lg text-primary">
            FTB
          </span>
        </div>

        <nav className="space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-md transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-body">Retour au site</span>
          </Link>

          <div className="border-t border-slate-200 my-4"></div>

          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-md transition-colors font-body',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
