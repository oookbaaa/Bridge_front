'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { PublicRoute } from '@/components/protected-route';

interface LoginFormData {
  email: string;
  password: string;
}

// Validation schema
const loginSchema = yup.object({
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required('Le mot de passe est obligatoire')
    .min(1, 'Le mot de passe ne peut pas être vide'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data.email, data.password);

      if (response.success) {
        // Show success toast
        toast({
          variant: 'default',
          title: 'Connexion réussie!',
          description: `Bienvenue ${response.user?.firstName} ${response.user?.lastName}`,
          duration: 3000,
        });

        // Small delay to show the toast before redirect
        setTimeout(() => {
          // Redirect based on user role
          if (response.user?.role?.title === 'Admin') {
            router.push('/admin');
          } else {
            router.push('/dashboard');
          }
        }, 500);
      } else {
        // Show error toast
        toast({
          variant: 'destructive',
          title: 'Échec de la connexion',
          description:
            response.error || 'Vérifiez vos identifiants et réessayez.',
        });

        // Also set form error for immediate feedback
        form.setError('root', {
          message: response.error || 'Échec de la connexion',
        });
      }
    } catch (err: any) {
      // Show error toast
      toast({
        variant: 'destructive',
        title: 'Erreur de connexion',
        description: err.message || "Une erreur inattendue s'est produite",
      });

      form.setError('root', {
        message: err.message || "Une erreur inattendue s'est produite",
      });
    }
  };

  // Function to auto-fill demo credentials
  const fillDemoCredentials = (email: string, password: string) => {
    form.setValue('email', email);
    form.setValue('password', password);

    // Show informative toast
    toast({
      variant: 'default',
      title: 'Identifiants remplis',
      description:
        'Vous pouvez maintenant vous connecter avec ces identifiants de démonstration.',
      duration: 2000,
    });
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        <Header />

        <div className="max-w-md mx-auto px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl text-primary">
                Bienvenue
              </CardTitle>
              <p className="font-body text-slate-600">
                Connectez-vous à votre compte FTB
              </p>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {form.formState.errors.root && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {form.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Adresse email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Entrez votre email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body">
                          Mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Entrez votre mot de passe"
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="font-body text-slate-600">
                  Vous n'avez pas de compte?{' '}
                  <Link
                    href="/register"
                    className="text-accent hover:underline font-semibold"
                  >
                    Rejoindre FTB
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-body font-semibold text-sm text-slate-700 mb-3">
                  Comptes de démonstration:
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-body text-xs text-slate-600">
                      <p>
                        <strong>Admin:</strong> ahmed@example.com
                      </p>
                      <p className="text-slate-500">Mot de passe: admin123</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fillDemoCredentials('ahmed@example.com', 'admin123')
                      }
                      className="text-xs"
                    >
                      Utiliser
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-body text-xs text-slate-600">
                      <p>
                        <strong>Joueur:</strong> fatima@example.com
                      </p>
                      <p className="text-slate-500">Mot de passe: player123</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        fillDemoCredentials('fatima@example.com', 'player123')
                      }
                      className="text-xs"
                    >
                      Utiliser
                    </Button>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <Link
                  href="#"
                  className="font-body text-sm text-slate-500 hover:text-accent underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </PublicRoute>
  );
}
