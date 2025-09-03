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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Trophy,
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useRegister } from '@/hooks/use-api';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PublicRoute } from '@/components/protected-route';

type StepType = 'basic' | 'details' | 'optional';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
  cin: string;
  genre: 'Homme' | 'Femme' | '';
  phone: string;
  dateOfBirth: string;
  adresse: string;
  // Optional fields
  disipline?: string;
  passportNumber?: string;
  birthPlace?: string;
  studyLevel?: string;
  club?: string;
  equipeNationale?: boolean;
  licenseNumber?: string;
}

// Validation schemas for each step
const basicSchema = yup.object({
  firstName: yup
    .string()
    .required('Le prénom est obligatoire')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: yup
    .string()
    .required('Le nom est obligatoire')
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: yup
    .string()
    .required("L'email est obligatoire")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required('Le mot de passe est obligatoire')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: yup
    .string()
    .required('La confirmation est obligatoire')
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas'),
});

const detailsSchema = yup.object({
  city: yup.string().required('La ville est obligatoire'),
  cin: yup
    .string()
    .required('Le CIN est obligatoire')
    .matches(/^\d{8}$/, 'Le CIN doit contenir exactement 8 chiffres'),
  genre: yup
    .string()
    .required('Le genre est obligatoire')
    .oneOf(['Homme', 'Femme'], 'Genre invalide'),
  phone: yup
    .string()
    .required('Le téléphone est obligatoire')
    .matches(
      /^(\+216|216|0)?[0-9]{8}$/,
      'Format de téléphone invalide (ex: +216 12 345 678)'
    ),
  dateOfBirth: yup.string().required('La date de naissance est obligatoire'),
  adresse: yup
    .string()
    .required("L'adresse est obligatoire")
    .min(5, "L'adresse doit contenir au moins 5 caractères"),
});

const optionalSchema = yup.object({
  licenseNumber: yup.string().optional(),
  disipline: yup.string().optional(),
  passportNumber: yup.string().optional(),
  birthPlace: yup.string().optional(),
  studyLevel: yup.string().optional(),
  club: yup.string().optional(),
  equipeNationale: yup.boolean().optional(),
});

// Combined schema for final validation
const fullSchema = basicSchema.concat(detailsSchema).concat(optionalSchema);

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<StepType>('basic');
  const [completedSteps, setCompletedSteps] = useState<Set<StepType>>(
    new Set()
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [licenseStatus, setLicenseStatus] = useState<
    'has-license' | 'unknown-license' | 'no-license' | ''
  >('');
  const [unknownLicense, setUnknownLicense] = useState(false);

  const registerMutation = useRegister();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: yupResolver(fullSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: '',
      cin: '',
      genre: '',
      phone: '',
      dateOfBirth: '',
      adresse: '',
      equipeNationale: false,
      licenseNumber: '',
    },
    mode: 'onChange',
  });

  const steps = [
    {
      id: 'basic' as StepType,
      title: 'Informations de base',
      description: 'Vos informations de connexion',
      icon: User,
      fields: [
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword',
        'licenseNumber',
      ],
      schema: basicSchema,
    },
    {
      id: 'details' as StepType,
      title: 'Informations personnelles',
      description: 'Détails requis pour votre profil',
      icon: FileText,
      fields: ['city', 'cin', 'genre', 'phone', 'dateOfBirth', 'adresse'],
      schema: detailsSchema,
    },
    {
      id: 'optional' as StepType,
      title: 'Informations Bridge',
      description: 'Personnalisez votre profil bridge',
      icon: Trophy,
      fields: [
        'disipline',
        'passportNumber',
        'birthPlace',
        'studyLevel',
        'club',
        'equipeNationale',
      ],
      schema: optionalSchema,
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const currentStepConfig = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const tunisianCities = [
    'Tunis',
    'Sfax',
    'Sousse',
    'Kairouan',
    'Bizerte',
    'Gabes',
    'Ariana',
    'Gafsa',
    'Monastir',
    'Ben Arous',
    'Kasserine',
    'Medenine',
    'Nabeul',
    'Tataouine',
    'Beja',
    'Jendouba',
    'Mahdia',
    'Sidi Bouzid',
    'Siliana',
    'Tozeur',
    'Zaghouan',
    'Manouba',
    'Kef',
    'Kebili',
  ];

  const disciplines = [
    { value: 'open', label: 'Open' },
    { value: 'dame', label: 'Dame' },
    { value: 'mixte', label: 'Mixte' },
    { value: 'senior', label: 'Senior' },
  ];

  const studyLevels = [
    { value: 'primaire', label: 'Primaire' },
    { value: 'secondaire', label: 'Secondaire' },
    { value: 'superieure', label: 'Supérieure' },
    { value: 'doctorat', label: 'Doctorat' },
    { value: 'autre', label: 'Autre' },
  ];

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepFields = currentStepConfig.fields;
    const isValid = await form.trigger(stepFields as any);

    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      // Show success toast for step completion
      toast({
        variant: 'default',
        title: 'Étape validée!',
        description: `${currentStepConfig.title} complétée avec succès.`,
        duration: 2000,
      });
    } else {
      // Show validation error toast
      toast({
        variant: 'destructive',
        title: 'Validation échouée',
        description: 'Veuillez corriger les erreurs avant de continuer.',
        duration: 3000,
      });
    }

    return isValid;
  };

  const goToStep = async (targetStep: StepType) => {
    const targetStepIndex = steps.findIndex((step) => step.id === targetStep);

    // If going forward, validate current step
    if (targetStepIndex > currentStepIndex) {
      const isValid = await validateCurrentStep();
      if (!isValid) {
        toast({
          variant: 'destructive',
          title: 'Impossible de continuer',
          description: `Vous devez d'abord compléter l'étape "${currentStepConfig.title}".`,
          duration: 3000,
        });
        return;
      }
    }

    // If going to a previous step, check if it was completed
    if (targetStepIndex < currentStepIndex) {
      if (!completedSteps.has(targetStep) && targetStep !== 'basic') {
        toast({
          variant: 'destructive',
          title: 'Étape non accessible',
          description: `L'étape "${steps[targetStepIndex].title}" n'a pas encore été complétée.`,
          duration: 3000,
        });
        return; // Don't allow going to uncompleted previous steps (except basic)
      }
    }

    setCurrentStep(targetStep);
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Validation requise',
        description:
          'Veuillez remplir correctement tous les champs obligatoires de cette étape.',
        duration: 3000,
      });
      return;
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(steps[prevStepIndex].id);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const registerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        city: data.city,
        cin: parseInt(data.cin),
        genre: data.genre as 'Homme' | 'Femme',
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        adresse: data.adresse,
        ...(data.disipline && { disipline: data.disipline }),
        ...(data.passportNumber && { passportNumber: data.passportNumber }),
        ...(data.birthPlace && { birthPlace: data.birthPlace }),
        ...(data.studyLevel && { studyLevel: data.studyLevel }),
        ...(data.club && { club: data.club }),
        ...(data.equipeNationale && { equipeNationale: data.equipeNationale }),
        ...(data.licenseNumber && { licenseNumber: data.licenseNumber }),
      };

      const response = await registerMutation.mutateAsync(registerData);

      if (response.success) {
        // Show success toast
        toast({
          variant: 'default',
          title: 'Inscription réussie!',
          description: `Bienvenue ${data.firstName} ${data.lastName}! Votre compte a été créé avec succès.`,
          duration: 4000,
        });

        // Small delay to show the toast before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        // Show error toast
        toast({
          variant: 'destructive',
          title: "Échec de l'inscription",
          description:
            response.error ||
            "Une erreur s'est produite lors de la création de votre compte.",
          duration: 5000,
        });

        form.setError('root', {
          message: response.error || "Erreur lors de l'inscription",
        });
      }
    } catch (err: any) {
      // Show error toast
      toast({
        variant: 'destructive',
        title: "Erreur d'inscription",
        description: err.message || "Une erreur inattendue s'est produite",
        duration: 5000,
      });

      form.setError('root', {
        message: err.message || "Une erreur inattendue s'est produite",
      });
    }
  };

  const isStepCompleted = (stepId: StepType) => completedSteps.has(stepId);
  const isStepActive = (stepId: StepType) => currentStep === stepId;
  const isStepAccessible = (stepId: StepType) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    if (stepIndex === 0) return true; // Basic step is always accessible
    const prevStep = steps[stepIndex - 1];
    return completedSteps.has(prevStep.id);
  };

  return (
    <PublicRoute>
      <div className="min-h-screen bg-white">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-heading text-2xl text-primary">
                Rejoindre FTB
              </CardTitle>
              <p className="font-body text-slate-600">
                Créez votre compte et commencez à jouer au bridge
              </p>

              {/* Enhanced Progress Indicator */}
              <div className="mt-6 space-y-4">
                <Progress value={progress} className="w-full" />

                <div className="flex justify-between">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const completed = isStepCompleted(step.id);
                    const active = isStepActive(step.id);
                    const accessible = isStepAccessible(step.id);

                    return (
                      <button
                        key={step.id}
                        onClick={() => (accessible ? goToStep(step.id) : null)}
                        disabled={!accessible}
                        className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200 ${
                          active
                            ? 'bg-accent text-white shadow-md'
                            : completed
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                            : accessible
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="relative">
                          {completed ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <StepIcon className="h-6 w-6" />
                          )}
                          {active && (
                            <div className="absolute -inset-1 bg-white rounded-full opacity-30 animate-pulse" />
                          )}
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-sm">
                            {step.title}
                          </div>
                          <div className="text-xs opacity-75 line-clamp-2">
                            {step.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {form.formState.errors.root && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {form.formState.errors.root.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Basic Information Step */}
                  {currentStep === 'basic' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">
                          Informations de base
                        </h3>
                        <p className="text-sm text-gray-600">
                          Vos informations de connexion
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre prénom" {...field} />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom *</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="votre.email@exemple.com"
                                {...field}
                              />
                            </FormControl>
                            <div className="min-h-[1.25rem] mt-1">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mot de passe *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Min. 6 caractères"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmer *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    type={
                                      showConfirmPassword ? 'text' : 'password'
                                    }
                                    placeholder="Confirmez le mot de passe"
                                    className="pr-10"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowConfirmPassword(
                                        !showConfirmPassword
                                      )
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <FormLabel className="text-base font-medium">
                            Numéro de licence Bridge
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600 mb-3">
                            Avez-vous déjà un numéro de licence de bridge?
                          </FormDescription>

                          <RadioGroup
                            value={licenseStatus}
                            onValueChange={(value) => {
                              setLicenseStatus(value as typeof licenseStatus);
                              // Clear license number when not needed
                              if (value !== 'has-license') {
                                form.setValue('licenseNumber', '');
                              }
                            }}
                            className="space-y-3"
                          >
                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <RadioGroupItem
                                value="has-license"
                                id="has-license"
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor="has-license"
                                  className="text-sm font-medium cursor-pointer block"
                                >
                                  J'ai un numéro de licence
                                </label>
                              </div>
                            </div>

                            <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <RadioGroupItem
                                value="no-license"
                                id="no-license"
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor="no-license"
                                  className="text-sm font-medium"
                                >
                                  Je n'ai pas encore de numéro de licence
                                </label>
                              </div>
                            </div>
                          </RadioGroup>

                          <p className="text-xs text-gray-500 mt-2">
                            * Champ obligatoire
                          </p>
                        </div>

                        {/* Conditional License Number Input */}
                        {licenseStatus === 'has-license' && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <FormField
                              control={form.control}
                              name="licenseNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Numéro de licence</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Entrez votre numéro de licence"
                                      {...field}
                                      className="bg-white"
                                      disabled={unknownLicense}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                  <div className="flex items-center space-x-2 mt-3">
                                    <Checkbox
                                      checked={unknownLicense}
                                      onCheckedChange={(checked) => {
                                        setUnknownLicense(!!checked);
                                        if (checked) {
                                          form.setValue('licenseNumber', '');
                                        }
                                      }}
                                      disabled={field.value !== ''}
                                    />
                                    <label className="text-sm text-gray-600">
                                      Je ne connais pas mon numéro de licence
                                    </label>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Personal Details Step */}
                  {currentStep === 'details' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">
                          Informations personnelles
                        </h3>
                        <p className="text-sm text-gray-600">
                          Détails requis pour votre profil
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ville *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez votre ville" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {tunisianCities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CIN *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12345678"
                                  maxLength={8}
                                  {...field}
                                />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="genre"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Genre *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez votre genre" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Homme">Homme</SelectItem>
                                  <SelectItem value="Femme">Femme</SelectItem>
                                </SelectContent>
                              </Select>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone *</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+216 12 345 678"
                                  {...field}
                                />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date de naissance *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <div className="min-h-[1.25rem] mt-1">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="adresse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Votre adresse complète"
                                {...field}
                              />
                            </FormControl>
                            <div className="min-h-[1.25rem] mt-1">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Optional Information Step */}
                  {currentStep === 'optional' && (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold">
                          Informations Bridge (Optionnel)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Personnalisez votre profil bridge
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="disipline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Discipline</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choisir une discipline" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {disciplines.map((discipline) => (
                                    <SelectItem
                                      key={discipline.value}
                                      value={discipline.value}
                                    >
                                      {discipline.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="studyLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Niveau d'étude</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Votre niveau d'étude" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {studyLevels.map((level) => (
                                    <SelectItem
                                      key={level.value}
                                      value={level.value}
                                    >
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="passportNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Numéro de passeport</FormLabel>
                              <FormControl>
                                <Input placeholder="A1234567" {...field} />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="birthPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lieu de naissance</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ville de naissance"
                                  {...field}
                                />
                              </FormControl>
                              <div className="min-h-[1.25rem] mt-1">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="club"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Club de Bridge</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nom de votre club"
                                {...field}
                              />
                            </FormControl>
                            <div className="min-h-[1.25rem] mt-1">
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="equipeNationale"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Membre de l'équipe nationale
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStepIndex === 0}
                      className="flex items-center space-x-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Précédent</span>
                    </Button>

                    {currentStepIndex === steps.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent/90"
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Création...</span>
                          </>
                        ) : (
                          <>
                            <span>Créer mon compte</span>
                            <CheckCircle className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent/90"
                      >
                        <span>Continuer</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="font-body text-slate-600">
                  Vous avez déjà un compte?{' '}
                  <Link
                    href="/login"
                    className="text-accent hover:underline font-semibold"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-body font-semibold text-sm text-slate-700 mb-2">
                  Ce que vous obtenez:
                </h4>
                <ul className="font-body text-xs text-slate-600 space-y-1">
                  <li>• Accès à tous les tournois et événements</li>
                  <li>• Tableau de bord personnel avec statistiques</li>
                  <li>• Classement officiel et suivi des points</li>
                  <li>• Fonctionnalités communautaires et réseautage</li>
                  <li>• Gestion automatique des licences</li>
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
