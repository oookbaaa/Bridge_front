'use client';

import React, { useState } from 'react';
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
import { Loader2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useResendVerification } from '@/hooks/use-api';
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

export default function ResendVerificationPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const resendVerificationMutation = useResendVerification();

  const form = useForm<ResendVerificationFormData>({
    resolver: yupResolver(resendSchema) as any,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ResendVerificationFormData) => {
    setIsLoading(true);

    try {
      const result = await resendVerificationMutation.mutateAsync({
        email: data.email,
      });

      setIsSubmitted(true);
      toast({
        variant: 'default',
        title: 'Email envoyé!',
        description:
          'Un nouveau lien de vérification a été envoyé à votre adresse email.',
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || "Erreur lors de l'envoi de l'email",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <PublicRoute>
        <div className="min-h-screen bg-white">
          <Header />

          <div className="max-w-md mx-auto px-4 py-12">
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="font-heading text-2xl text-primary">
                  Email envoyé!
                </CardTitle>
                <p className="font-body text-slate-600">
                  Vérifiez votre boîte de réception
                </p>
              </CardHeader>

              <CardContent className="text-center">
                <div className="py-6">
                  <p className="text-gray-600 mb-6">
                    Un nouveau lien de vérification a été envoyé à votre adresse
                    email. Veuillez vérifier votre boîte de réception et cliquer
                    sur le lien pour activer votre compte.
                  </p>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Conseils :
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Vérifiez votre dossier spam/indésirable</li>
                      <li>• Assurez-vous que l'email est correct</li>
                      <li>• Le lien expire dans 24 heures</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full"
                  >
                    Retour à la connexion
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      form.reset();
                    }}
                    className="w-full"
                  >
                    Envoyer un autre email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Footer />
        </div>
      </PublicRoute>
    );
  }

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
                Renvoyer l'email de vérification
              </CardTitle>
              <p className="font-body text-slate-600">
                Entrez votre adresse email pour recevoir un nouveau lien de
                vérification
              </p>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de vérification'
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-slate-600 hover:text-accent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à la connexion
                </Link>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">
                  Pourquoi renvoyer l'email?
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Vous n'avez pas reçu l'email de vérification</li>
                  <li>• Le lien de vérification a expiré</li>
                  <li>• Vous avez supprimé l'email par erreur</li>
                  <li>• L'email est dans votre dossier spam</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </PublicRoute>
  );
}
