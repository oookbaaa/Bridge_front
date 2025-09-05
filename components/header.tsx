'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { RoleGuard } from '@/components/role-guard';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Accueil', href: '/' },
    // { name: 'Classement', href: '/rankings' },
    // { name: 'Evenements', href: '/events' },
    { name: 'A propos', href: '/about' },
    // { name: 'Contactez-nous', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-sm shadow-sm border-b transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Tunisian Bridge Federation"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-heading font-bold text-xl text-primary transition-colors duration-200 group-hover:text-primary/80">
                Fédération tunisienne de bridge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative font-body transition-all duration-200 px-3 py-2 rounded-md ${
                    isActive
                      ? 'text-primary font-semibold bg-primary/10'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transform scale-x-100 transition-transform duration-200" />
                  )}
                  <div
                    className={`absolute inset-0 rounded-md transition-all duration-200 ${
                      isActive ? 'bg-primary/5' : 'bg-transparent'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.firstName} {user.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="font-body font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="font-body text-sm text-slate-600">
                      {user.email}
                    </p>
                    {/* Added role guard for admin badge */}
                    <RoleGuard allowedRoles={['Admin']}>
                      <p className="font-body text-xs text-accent font-semibold">
                        Administrateur
                      </p>
                    </RoleGuard>
                  </div>
                  <DropdownMenuSeparator />
                  {/* Added role-based menu items */}
                  <RoleGuard allowedRoles={['Admin']}>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex items-center transition-colors duration-200 hover:text-primary"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Panneau d'administration
                      </Link>
                    </DropdownMenuItem>
                  </RoleGuard>
                  <RoleGuard allowedRoles={['Player']}>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center transition-colors duration-200 hover:text-primary"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Mon tableau de bord
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/rankings"
                        className="flex items-center transition-colors duration-200 hover:text-primary"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Mon classement
                      </Link>
                  
                    </DropdownMenuItem>
                    
                  </RoleGuard>
                
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Se connecter</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-accent hover:bg-accent/90"
                  asChild
                >
                  <Link href="/register">Rejoindre</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-body block px-3 py-2 text-base rounded-md transition-all duration-200 ${
                      isActive
                        ? 'text-primary font-semibold bg-primary/10'
                        : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <div className="border-t pt-4">
                {user ? (
                  <div className="px-3 space-y-2">
                    <div className="py-2">
                      <p className="font-body font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="font-body text-sm text-slate-600">
                        {user.email}
                      </p>
                    </div>
                    {/* Added role-based mobile menu items */}
                    <RoleGuard allowedRoles={['Admin']}>
                      <Link
                        href="/admin"
                        className="font-body text-slate-600 hover:text-primary hover:bg-slate-50 block py-2 px-3 rounded-md transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Panneau d'administration
                      </Link>
                    </RoleGuard>
                      <RoleGuard allowedRoles={['Player']}>
                      <Link
                        href="/dashboard"
                        className="font-body text-slate-600 hover:text-primary hover:bg-slate-50 block py-2 px-3 rounded-md transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mon tableau de bord
                      </Link>
                    </RoleGuard>
                    <button
                      onClick={handleLogout}
                      className="font-body text-red-600 hover:text-red-700 hover:bg-red-50 block py-2 px-3 rounded-md w-full text-left transition-all duration-200"
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/login">Se connecter</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-accent hover:bg-accent/90"
                      asChild
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href="/register">Rejoindre</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
