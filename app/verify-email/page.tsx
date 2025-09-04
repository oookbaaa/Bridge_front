'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  ArrowLeft,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useVerifyEmail, useResendVerification } from '@/hooks/use-api';
import { PublicRoute } from '@/components/protected-route';

interface ResendVerificationFormData {
  email: string;
}

const resendSchema = yup.object({
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Format d'email invalide"),
});

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error' | 'expired' | 'already-used' | null
  >(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [showResendForm, setShowResendForm] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  const form = useForm<ResendVerificationFormData>({
    resolver: yupResolver(resendSchema) as any,
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setVerificationMessage('Token de vérification manquant');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    setVerificationStatus('loading');

    try {
      const result = await verifyEmailMutation.mutateAsync({ token });

      setVerificationStatus('success');
      setVerificationMessage(result.message);
      setUserEmail(result.user?.email || '');

      toast({
        variant: 'default',
        title: 'Email vérifié avec succès!',
        description:
          'Votre compte est en cours d\'approbation. Vous recevrez un email de confirmation une fois approuvé.',
        duration: 5000,
      });
    } catch (error: any) {
      setVerificationStatus('error');
      setVerificationMessage(error.message || 'Erreur lors de la vérification');

      // Check if it's an expired or already used token
      if (error.message?.includes('expiré')) {
        setVerificationStatus('expired');
      } else if (error.message?.includes('déjà été utilisé')) {
        setVerificationStatus('already-used');
      }
    }
  };

  const resendVerification = async (data: ResendVerificationFormData) => {
    try {
      const result = await resendVerificationMutation.mutateAsync({
        email: data.email,
      });

      toast({
        variant: 'default',
        title: 'Email envoyé!',
        description:
          'Un nouveau lien de vérification a été envoyé à votre adresse email.',
        duration: 5000,
      });
      setShowResendForm(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || "Erreur lors de l'envoi de l'email",
        duration: 5000,
      });
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2">
              Vérification en cours...
            </h3>
            <p className="text-gray-600">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              Email vérifié avec succès!
            </h3>
            <p className="text-gray-600 mb-6">{verificationMessage}</p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Se connecter maintenant
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>
          </div>
        );

      case 'expired':
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-600" />
            <h3 className="text-lg font-semibold mb-2 text-orange-800">
              Lien expiré
            </h3>
            <p className="text-gray-600 mb-6">
              Le lien de vérification a expiré. Veuillez demander un nouveau
              lien.
            </p>
            <Button
              onClick={() => setShowResendForm(true)}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Demander un nouveau lien
            </Button>
          </div>
        );

      case 'already-used':
        return (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold mb-2 text-blue-800">
              Email déjà vérifié
            </h3>
            <p className="text-gray-600 mb-6">
              Cet email a déjà été vérifié. Vous pouvez vous connecter à votre
              compte.
            </p>
            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Se connecter
            </Button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h3 className="text-lg font-semibold mb-2 text-red-800">
              Erreur de vérification
            </h3>
            <p className="text-gray-600 mb-6">{verificationMessage}</p>
            <div className="space-y-3">
              <Button
                onClick={() => setShowResendForm(true)}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Demander un nouveau lien
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        <Header />

        <div className="max-w-md mx-auto px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="font-heading text-2xl text-primary">
                Vérification d'email
              </CardTitle>
              <p className="font-body text-slate-600">
                Confirmez votre adresse email pour activer votre compte
              </p>
            </CardHeader>

            <CardContent>
              {renderContent()}

              {showResendForm && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-lg font-semibold mb-4">
                    Demander un nouveau lien
                  </h4>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(resendVerification)}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="votre.email@exemple.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          'Envoyer un nouveau lien'
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
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
