'use client';

import type React from 'react';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'player';
  requireAuth?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(fallbackPath);
      return;
    }

    // Check role-based access
    if (
      requiredRole &&
      user &&
      user.role.title.toLowerCase() !== requiredRole
    ) {
      setShowUnauthorized(true);
      return;
    }

    setShowUnauthorized(false);
  }, [user, loading, requireAuth, requiredRole, router, fallbackPath]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-body text-slate-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  // Unauthorized access
  if (showUnauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="font-heading text-xl text-red-600">
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-body text-sm">
                Permissions insuffisantes
              </span>
            </div>
            <p className="font-body text-slate-600">
              Vous n'avez pas les permissions requises pour accéder à cette
              page.
              {requiredRole && (
                <>
                  <br />
                  <span className="text-sm">Rôle requis: {requiredRole}</span>
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => router.back()} variant="outline">
                Retour
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="bg-primary hover:bg-primary/90"
              >
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not authenticated (will redirect)
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-body text-slate-600">
            Redirection vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

  // Authorized - render children
  return <>{children}</>;
}

// Loading screen component
function AuthLoadingScreen({
  message = 'Chargement...',
}: {
  message?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="font-body text-slate-600">{message}</p>
      </div>
    </div>
  );
}

// Public route component - Guards against authenticated access (for login/register pages)
export function PublicRoute({
  children,
  redirectTo = '/dashboard',
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Don't render children if user is authenticated (will be redirected)
  if (user) {
    return null;
  }

  return <>{children}</>;
}
