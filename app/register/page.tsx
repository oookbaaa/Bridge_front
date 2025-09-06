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
import { Stepper, StepperProgress, Step } from '@/components/ui/stepper';
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
  Upload,
  X,
  ImageIcon,
  FileIcon,
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
import {
  useRegister,
  useFileUpload,
  useFileUploadForRegistration,
  useVerifyLicense,
  useLookupLicense,
  useCheckCinAvailability,
  useCheckPhoneAvailability,
} from '@/hooks/use-api';
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
  // ID Document files
  idFrontFile?: File | null;
  idBackFile?: File | null;
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
  cin: yup
    .string()
    .required('Le CIN est obligatoire')
    .matches(/^\d{8}$/, 'Le CIN doit contenir exactement 8 chiffres'),
  idFrontFile: yup
    .mixed()
    .required('La photo recto de votre CIN est obligatoire')
    .test('fileSize', 'Le fichier ne doit pas dépasser 2MB', (value) => {
      if (!value) return false;
      return (value as File).size <= 2 * 1024 * 1024;
    })
    .test(
      'fileFormat',
      'Format de fichier non supporté (JPG, PNG, PDF uniquement)',
      (value) => {
        if (!value) return false;
        const file = value as File;
        return [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
        ].includes(file.type);
      }
    ),
  idBackFile: yup
    .mixed()
    .required('La photo verso de votre CIN est obligatoire')
    .test('fileSize', 'Le fichier ne doit pas dépasser 2MB', (value) => {
      if (!value) return false;
      return (value as File).size <= 2 * 1024 * 1024;
    })
    .test(
      'fileFormat',
      'Format de fichier non supporté (JPG, PNG, PDF uniquement)',
      (value) => {
        if (!value) return false;
        const file = value as File;
        return [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'application/pdf',
        ].includes(file.type);
      }
    ),
});

const detailsSchema = yup.object({
  city: yup.string().required('La ville est obligatoire'),
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

// File Upload Component
const FileUploadComponent = ({
  field,
  label,
  description,
  accept = 'image/*,.pdf',
}: {
  field: any;
  label: string;
  description?: string;
  accept?: string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    field.onChange(file);
  };

  const removeFile = () => {
    field.onChange(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return FileIcon;
    return ImageIcon;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && <p className="text-xs text-gray-600">{description}</p>}

      <div className="border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-gray-400 transition-colors">
        {field.value ? (
          <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded-sm">
            <div className="flex items-center space-x-1.5">
              {React.createElement(getFileIcon(field.value.name), {
                className: 'h-3 w-3 text-gray-500',
              })}
              <span className="text-xs text-gray-700 truncate max-w-[120px]">
                {field.value.name}
              </span>
              <span className="text-xs text-gray-500">
                ({(field.value.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-3 w-3 text-red-500" />
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center space-y-1.5 py-2">
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-xs text-gray-600 text-center">
              Cliquez pour sélectionner
            </span>
            <span className="text-xs text-gray-500 text-center">
              JPG, PNG, PDF (max. 2MB)
            </span>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
};

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
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [licenseVerificationData, setLicenseVerificationData] =
    useState<any>(null);
  const [licenseLookupData, setLicenseLookupData] = useState<any>(null);
  const [licenseLookupSuccess, setLicenseLookupSuccess] = useState(false);
  const [cinValidationStatus, setCinValidationStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid'
  >('idle');
  const [phoneValidationStatus, setPhoneValidationStatus] = useState<
    'idle' | 'checking' | 'valid' | 'invalid'
  >('idle');

  const registerMutation = useRegister();
  const fileUploadMutation = useFileUpload();
  const fileUploadForRegistrationMutation = useFileUploadForRegistration();
  const verifyLicenseMutation = useVerifyLicense();
  const lookupLicenseMutation = useLookupLicense();
  const checkCinMutation = useCheckCinAvailability();
  const checkPhoneMutation = useCheckPhoneAvailability();
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
      idFrontFile: null,
      idBackFile: null,
      equipeNationale: false,
      licenseNumber: '',
    },
    mode: 'onChange',
  });

  const stepConfigs = [
    {
      id: 'basic' as StepType,
      title: 'Informations de base',
      description: 'Vos informations de connexion et vérification de licence',
      icon: User,
      fields: [
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmPassword',
        'cin',
        'licenseNumber',
        'idFrontFile',
        'idBackFile',
      ],
      schema: basicSchema,
    },
    {
      id: 'details' as StepType,
      title: 'Informations personnelles',
      description: 'Détails requis pour votre profil',
      icon: FileText,
      fields: ['city', 'genre', 'phone', 'dateOfBirth', 'adresse'],
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

  // Convert to stepper format
  const steps: Step[] = stepConfigs.map((step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    icon: step.icon,
  }));

  const currentStepIndex = stepConfigs.findIndex(
    (step) => step.id === currentStep
  );
  const currentStepConfig = stepConfigs[currentStepIndex];

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

    // Use trigger with mode 'onChange' to avoid form submission
    const isValid = await form.trigger(stepFields as any);

    // Additional validation for basic step (CIN validation and ID documents)
    if (currentStep === 'basic' && isValid) {
      // Check if CIN validation is still in progress or invalid
      if (cinValidationStatus === 'checking') {
        toast({
          variant: 'destructive',
          title: 'Validation en cours',
          description:
            'Veuillez attendre la validation du CIN avant de continuer.',
          duration: 3000,
        });
        return false;
      }

      if (cinValidationStatus === 'invalid') {
        toast({
          variant: 'destructive',
          title: 'CIN invalide',
          description:
            'Le CIN que vous avez saisi est déjà utilisé par un autre utilisateur.',
          duration: 3000,
        });
        return false;
      }

      // Ensure CIN is validated
      if (cinValidationStatus !== 'valid') {
        toast({
          variant: 'destructive',
          title: 'CIN requis',
          description: 'Veuillez saisir un CIN valide avant de continuer.',
          duration: 3000,
        });
        return false;
      }

      // Check if ID documents are uploaded
      const idFrontFile = form.getValues('idFrontFile');
      const idBackFile = form.getValues('idBackFile');

      if (!idFrontFile || !idBackFile) {
        toast({
          variant: 'destructive',
          title: "Documents d'identité requis",
          description:
            'Veuillez télécharger les photos recto et verso de votre CIN avant de continuer.',
          duration: 3000,
        });
        return false;
      }
    }

    // Additional validation for details step
    if (currentStep === 'details' && isValid) {
      // Check if phone validation is still in progress or invalid
      if (phoneValidationStatus === 'checking') {
        toast({
          variant: 'destructive',
          title: 'Validation en cours',
          description:
            'Veuillez attendre la validation du téléphone avant de continuer.',
          duration: 3000,
        });
        return false;
      }

      if (phoneValidationStatus === 'invalid') {
        toast({
          variant: 'destructive',
          title: 'Téléphone invalide',
          description:
            'Le numéro de téléphone que vous avez saisi est déjà utilisé par un autre utilisateur.',
          duration: 3000,
        });
        return false;
      }

      // Ensure phone is validated
      if (phoneValidationStatus !== 'valid') {
        toast({
          variant: 'destructive',
          title: 'Téléphone requis',
          description:
            'Veuillez saisir un numéro de téléphone valide avant de continuer.',
          duration: 3000,
        });
        return false;
      }
    }

    if (isValid) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));

      // Show success toast for step completion
      toast({
        variant: 'default',
        title: 'Étape validée!',
        description: `${currentStepConfig.title} complétée avec succès.`,
        duration: 2000,
      });
    }

    return isValid;
  };

  const goToStep = async (targetStep: StepType) => {
    const targetStepIndex = stepConfigs.findIndex(
      (step) => step.id === targetStep
    );

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
          description: `L'étape "${stepConfigs[targetStepIndex].title}" n'a pas encore été complétée.`,
          duration: 3000,
        });
        return; // Don't allow going to uncompleted previous steps (except basic)
      }
    }

    setCurrentStep(targetStep);
  };

  const handleStepClick = async (stepIndex: number, step: Step) => {
    const targetStep = step.id as StepType;
    await goToStep(targetStep);
  };

  const verifyLicenseNumber = async (): Promise<boolean> => {
    const licenseNumber = form.getValues('licenseNumber');
    const firstName = form.getValues('firstName');
    const lastName = form.getValues('lastName');
    const email = form.getValues('email');
    const cin = form.getValues('cin');

    if (!licenseNumber || !firstName || !lastName || !email) {
      return false;
    }

    try {
      const result = await verifyLicenseMutation.mutateAsync({
        licenseNumber,
        firstName,
        lastName,
        email,
        cin: cin ? parseInt(cin) : 0,
      });

      if (result.isValid) {
        setLicenseVerified(true);
        setLicenseVerificationData(result.licenseData);

        toast({
          variant: 'default',
          title: 'Licence vérifiée!',
          description: `Licence ${licenseNumber} vérifiée avec succès dans la base de données officielle.`,
          duration: 4000,
        });

        // Note: We don't auto-fill data from license, user must enter their own information
        // The Excel data is only used for verification purposes

        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur de vérification',
          description: result.message,
          duration: 5000,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de vérification',
        description: error.message || 'Impossible de vérifier la licence',
        duration: 5000,
      });
      return false;
    }
  };

  const checkCinAvailability = async (cin: string): Promise<void> => {
    if (!cin || cin.length !== 8) {
      setCinValidationStatus('idle');
      return;
    }

    setCinValidationStatus('checking');

    try {
      const result = await checkCinMutation.mutateAsync({ cin });

      if (result.available) {
        setCinValidationStatus('valid');
      } else {
        setCinValidationStatus('invalid');
        form.setError('cin', {
          type: 'manual',
          message: 'Ce CIN est déjà utilisé par un autre utilisateur',
        });
      }
    } catch (error: any) {
      setCinValidationStatus('invalid');
      form.setError('cin', {
        type: 'manual',
        message: 'Erreur lors de la vérification du CIN',
      });
    }
  };

  const checkPhoneAvailability = async (phone: string): Promise<void> => {
    if (!phone || phone.length < 8) {
      setPhoneValidationStatus('idle');
      return;
    }

    setPhoneValidationStatus('checking');

    try {
      const result = await checkPhoneMutation.mutateAsync({ phone });

      if (result.available) {
        setPhoneValidationStatus('valid');
      } else {
        setPhoneValidationStatus('invalid');
        form.setError('phone', {
          type: 'manual',
          message:
            'Ce numéro de téléphone est déjà utilisé par un autre utilisateur',
        });
      }
    } catch (error: any) {
      setPhoneValidationStatus('invalid');
      form.setError('phone', {
        type: 'manual',
        message: 'Erreur lors de la vérification du téléphone',
      });
    }
  };

  const lookupLicenseByNameAndEmail = async (): Promise<boolean> => {
    const firstName = form.getValues('firstName');
    const lastName = form.getValues('lastName');
    const email = form.getValues('email');
    const cin = form.getValues('cin');

    if (!firstName || !lastName || !email) {
      return false;
    }

    try {
      const result = await lookupLicenseMutation.mutateAsync({
        firstName,
        lastName,
        email,
        cin: cin ? parseInt(cin) : 0,
      });

      if (result.isValid && result.licenseData) {
        setLicenseLookupSuccess(true);
        setLicenseLookupData(result.licenseData);

        // Auto-fill the license number field
        form.setValue('licenseNumber', result.licenseData.licenseNumber);
        setLicenseVerified(true);
        setLicenseVerificationData(result.licenseData);

        toast({
          variant: 'default',
          title: 'Licence trouvée!',
          description: `Votre numéro de licence ${result.licenseData.licenseNumber} a été trouvé et rempli automatiquement.`,
          duration: 4000,
        });

        return true;
      } else {
        toast({
          variant: 'destructive',
          title: 'Licence non trouvée',
          description: result.message,
          duration: 5000,
        });
        return false;
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur de recherche',
        description: error.message || 'Impossible de rechercher la licence',
        duration: 5000,
      });
      return false;
    }
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

    // Special handling for basic step with license verification
    if (
      currentStep === 'basic' &&
      (licenseStatus === 'has-license' || licenseStatus === 'unknown-license')
    ) {
      const licenseNumber = form.getValues('licenseNumber');
      const email = form.getValues('email');

      if (licenseStatus === 'unknown-license' && !licenseLookupSuccess) {
        toast({
          variant: 'destructive',
          title: 'Recherche de licence requise',
          description: 'Veuillez rechercher votre licence avant de continuer.',
          duration: 4000,
        });
        return;
      }

      if (
        licenseStatus === 'has-license' &&
        licenseNumber &&
        !licenseVerified
      ) {
        if (!email) {
          toast({
            variant: 'destructive',
            title: 'Email requis',
            description: "L'email est requis pour la vérification de licence.",
            duration: 4000,
          });
          return;
        }

        const licenseValid = await verifyLicenseNumber();
        if (!licenseValid) {
          toast({
            variant: 'destructive',
            title: 'Vérification de licence requise',
            description:
              'Veuillez vérifier votre numéro de licence avant de continuer.',
            duration: 4000,
          });
          return;
        }
      }
    }

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex < stepConfigs.length) {
      setCurrentStep(stepConfigs[nextStepIndex].id);
    }
  };

  const handlePrevious = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      setCurrentStep(stepConfigs[prevStepIndex].id);
    }
  };

  const onSubmit = async (data: FormData) => {
    // Prevent submission if not on final step
    if (currentStepIndex !== stepConfigs.length - 1) {
      console.warn('Form submission prevented - not on final step');
      return;
    }

    try {
      // First, upload ID files if they exist (before user registration)
      const filesToUpload = [];
      if (data.idFrontFile) {
        filesToUpload.push({ file: data.idFrontFile, type: 'id_front' });
      }
      if (data.idBackFile) {
        filesToUpload.push({ file: data.idBackFile, type: 'id_back' });
      }

      // Upload files for registration (no authentication required)
      if (filesToUpload.length > 0) {
        try {
          // Upload files sequentially
          for (const { file, type } of filesToUpload) {
            await fileUploadForRegistrationMutation.mutateAsync({
              file,
              email: data.email,
              documentType: type,
            });

            toast({
              variant: 'default',
              title: 'Document téléchargé',
              description: `Photo ${
                type === 'id_front' ? 'recto' : 'verso'
              } téléchargée avec succès.`,
              duration: 2000,
            });
          }
        } catch (uploadError: any) {
          // File upload failed, show error but continue with registration
          toast({
            variant: 'destructive',
            title: 'Erreur lors du téléchargement',
            description: `Erreur lors du téléchargement des documents: ${uploadError.message}. L'inscription continuera sans les documents.`,
            duration: 5000,
          });
        }
      }

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

      // Register the user (this will also convert temporary files to permanent files)
      const response = await registerMutation.mutateAsync(registerData);

      if (response.success) {
        // Show success toast
        toast({
          variant: 'default',
          title: 'Inscription réussie!',
          description: `Bienvenue ${data.firstName} ${data.lastName}! Un email de vérification a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.`,
          duration: 8000,
        });

        // Clear any stored authentication data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ftb_token');
          localStorage.removeItem('ftb_user');
        }

        // Show additional toast with helpful tips
        setTimeout(() => {
          toast({
            variant: 'default',
            title: 'Conseil important',
            description:
              "Si vous ne recevez pas l'email, vérifiez votre dossier spam/indésirable. Vous pouvez également demander un nouveau lien depuis la page de connexion.",
            duration: 6000,
          });
        }, 2000);

        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 3000);
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
    const stepIndex = stepConfigs.findIndex((step) => step.id === stepId);
    if (stepIndex === 0) return true; // Basic step is always accessible
    const prevStep = stepConfigs[stepIndex - 1];
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

              {/* Stepper Component */}
              <div className="mt-6">
                <StepperProgress
                  steps={steps}
                  currentStep={currentStepIndex}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                  showProgress={true}
                  className="w-full"
                />
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Only allow submission on final step
                    if (currentStepIndex === stepConfigs.length - 1) {
                      form.handleSubmit(onSubmit)(e);
                    }
                  }}
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
                    <div className="space-y-6">
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          Informations personnelles
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Prénom *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Votre prénom"
                                    className="w-full h-10"
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
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Votre nom"
                                    className="w-full h-10"
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
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adresse email *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="votre.email@exemple.com"
                                    className="w-full h-10"
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
                            name="cin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  CIN (Carte d'Identité Nationale) *
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      placeholder="12345678"
                                      maxLength={8}
                                      className={`w-full h-10 pr-10 ${
                                        cinValidationStatus === 'valid'
                                          ? 'border-green-500 focus:border-green-500'
                                          : cinValidationStatus === 'invalid'
                                          ? 'border-red-500 focus:border-red-500'
                                          : ''
                                      }`}
                                      {...field}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          ''
                                        );
                                        field.onChange(value);
                                        setCinValidationStatus('idle');
                                        form.clearErrors('cin');
                                        if (value.length === 8) {
                                          const timeoutId = setTimeout(() => {
                                            checkCinAvailability(value);
                                          }, 500);
                                          return () => clearTimeout(timeoutId);
                                        }
                                      }}
                                    />
                                    {cinValidationStatus === 'checking' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                      </div>
                                    )}
                                    {cinValidationStatus === 'valid' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      </div>
                                    )}
                                    {cinValidationStatus === 'invalid' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <div className="min-h-[1.25rem] mt-1">
                                  <FormMessage />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Password Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          Mot de passe
                        </h3>

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
                                      className="w-full h-10 pr-10"
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
                                <FormLabel>
                                  Confirmer le mot de passe *
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type={
                                        showConfirmPassword
                                          ? 'text'
                                          : 'password'
                                      }
                                      placeholder="Confirmez le mot de passe"
                                      className="w-full h-10 pr-10"
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
                      </div>

                      {/* ID Document Upload Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          Documents d'identité
                        </h3>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-green-600" />
                            <h4 className="font-semibold text-green-800">
                              Photos de votre CIN requises
                            </h4>
                          </div>
                          <p className="text-sm text-green-700 mb-4">
                            Veuillez télécharger les photos recto et verso de
                            votre carte d'identité nationale.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="idFrontFile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <FileUploadComponent
                                      field={field}
                                      label="Photo Recto de la CIN *"
                                      description="Face avant de votre carte d'identité"
                                      accept="image/*,.pdf"
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
                              name="idBackFile"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <FileUploadComponent
                                      field={field}
                                      label="Photo Verso de la CIN *"
                                      description="Face arrière de votre carte d'identité"
                                      accept="image/*,.pdf"
                                    />
                                  </FormControl>
                                  <div className="min-h-[1.25rem] mt-1">
                                    <FormMessage />
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="text-xs text-green-600 bg-green-100 p-3 rounded-md mt-4">
                            <strong>
                              Conseils pour de meilleures photos :
                            </strong>
                            <ul className="mt-1 space-y-1">
                              <li>• Assurez-vous que le texte est lisible</li>
                              <li>• Évitez les reflets et les ombres</li>
                              <li>• Centrez la carte dans l'image</li>
                              <li>• Utilisez un bon éclairage</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      {/* License Verification Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                          Licence Bridge
                        </h3>

                        <div>
                          <FormLabel className="text-base font-medium">
                            Avez-vous déjà un numéro de licence de bridge?
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600 mb-4">
                            Si vous avez une licence, nous la vérifierons dans
                            notre base de données officielle.
                          </FormDescription>

                          <RadioGroup
                            value={licenseStatus}
                            onValueChange={(value) => {
                              setLicenseStatus(value as typeof licenseStatus);
                              // Clear license number when not needed
                              if (
                                value !== 'has-license' &&
                                value !== 'unknown-license'
                              ) {
                                form.setValue('licenseNumber', '');
                                setLicenseVerified(false);
                                setLicenseVerificationData(null);
                              }
                              // Reset lookup state when changing away from unknown-license
                              if (value !== 'unknown-license') {
                                setLicenseLookupSuccess(false);
                                setLicenseLookupData(null);
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
                                value="unknown-license"
                                id="unknown-license"
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor="unknown-license"
                                  className="text-sm font-medium cursor-pointer block"
                                >
                                  Je ne connais pas mon numéro de licence
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
                                  className="text-sm font-medium cursor-pointer block"
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
                        {(licenseStatus === 'has-license' ||
                          licenseStatus === 'unknown-license') && (
                          <div
                            className={`mt-4 p-4 border rounded-lg ${
                              licenseVerified
                                ? 'bg-green-50 border-green-200'
                                : 'bg-green-50 border-green-200'
                            }`}
                          >
                            <FormField
                              control={form.control}
                              name="licenseNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {licenseStatus === 'unknown-license'
                                      ? 'Recherche de licence'
                                      : 'Numéro de licence'}
                                  </FormLabel>
                                  <FormControl>
                                    <div className="space-y-3">
                                      {licenseStatus === 'unknown-license' ? (
                                        // License lookup by name and email
                                        <div className="space-y-3">
                                          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                            <p className="text-sm text-green-800 mb-3">
                                              <strong>
                                                Recherche automatique:
                                              </strong>{' '}
                                              Nous allons rechercher votre
                                              licence dans notre base de données
                                              officielle en utilisant votre nom
                                              et email.
                                            </p>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={
                                                lookupLicenseByNameAndEmail
                                              }
                                              disabled={
                                                lookupLicenseMutation.isPending ||
                                                !form.getValues('firstName') ||
                                                !form.getValues('lastName') ||
                                                !form.getValues('email') ||
                                                licenseLookupSuccess
                                              }
                                              className="w-full"
                                            >
                                              {lookupLicenseMutation.isPending ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                  Recherche en cours...
                                                </>
                                              ) : licenseLookupSuccess ? (
                                                <>
                                                  <CheckCircle className="h-4 w-4 mr-2" />
                                                  Licence trouvée
                                                </>
                                              ) : (
                                                'Rechercher ma licence'
                                              )}
                                            </Button>
                                          </div>

                                          {licenseLookupSuccess &&
                                            licenseLookupData && (
                                              <div className="p-3 bg-green-100 border border-green-300 rounded-md">
                                                <div className="flex items-center space-x-2 text-green-800 mb-2">
                                                  <CheckCircle className="h-4 w-4" />
                                                  <span className="font-medium">
                                                    Licence trouvée!
                                                  </span>
                                                </div>
                                                <div className="text-sm text-green-700">
                                                  <p>
                                                    ✅ Votre numéro de licence:{' '}
                                                    <strong>
                                                      {
                                                        licenseLookupData.licenseNumber
                                                      }
                                                    </strong>
                                                  </p>
                                                  <p>
                                                    ✅ Votre licence a été
                                                    automatiquement remplie et
                                                    vérifiée.
                                                  </p>
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      ) : (
                                        // Regular license number input
                                        <div className="flex space-x-2">
                                          <Input
                                            placeholder="Entrez votre numéro de licence"
                                            {...field}
                                            className="bg-white flex-1"
                                            onChange={(e) => {
                                              field.onChange(e);
                                              // Reset verification when license number changes
                                              if (licenseVerified) {
                                                setLicenseVerified(false);
                                                setLicenseVerificationData(
                                                  null
                                                );
                                              }
                                            }}
                                          />
                                          {field.value && (
                                            <Button
                                              type="button"
                                              variant={
                                                licenseVerified
                                                  ? 'default'
                                                  : 'outline'
                                              }
                                              size="sm"
                                              onClick={verifyLicenseNumber}
                                              disabled={
                                                verifyLicenseMutation.isPending ||
                                                !form.getValues('firstName') ||
                                                !form.getValues('lastName') ||
                                                !form.getValues('email')
                                              }
                                              className="min-w-[100px]"
                                            >
                                              {verifyLicenseMutation.isPending ? (
                                                <>
                                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                  Vérification...
                                                </>
                                              ) : licenseVerified ? (
                                                <>
                                                  <CheckCircle className="h-4 w-4 mr-2" />
                                                  Vérifiée
                                                </>
                                              ) : (
                                                'Vérifier'
                                              )}
                                            </Button>
                                          )}
                                        </div>
                                      )}

                                      {/* License Verification Status */}
                                      {licenseVerified && (
                                        <div className="p-3 bg-green-100 border border-green-300 rounded-md">
                                          <div className="flex items-center space-x-2 text-green-800">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-medium">
                                              Licence vérifiée avec succès!
                                            </span>
                                          </div>
                                          <div className="mt-2 text-sm text-green-700">
                                            <p>
                                              ✅ Votre numéro de licence a été
                                              vérifié avec succès dans la base
                                              de données officielle.
                                            </p>
                                            <p>
                                              ✅ Votre nom correspond aux
                                              informations du titulaire de la
                                              licence.
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormMessage />

                                  {!licenseVerified &&
                                    field.value &&
                                    licenseStatus === 'has-license' && (
                                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                        <p className="text-sm text-yellow-800">
                                          <strong>Note:</strong> Veuillez
                                          vérifier votre numéro de licence en
                                          cliquant sur "Vérifier" avant de
                                          continuer.
                                        </p>
                                      </div>
                                    )}
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
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Informations personnelles
                        </h3>
                        <p className="text-sm text-gray-600">
                          Détails requis pour votre profil
                        </p>
                      </div>

                      <div className="space-y-4">
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
                                    <SelectTrigger className="w-full h-10">
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
                            name="genre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Genre *</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full h-10">
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Téléphone *</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="tel"
                                      placeholder="+216 12 345 678"
                                      className={`w-full h-10 pr-10 ${
                                        phoneValidationStatus === 'valid'
                                          ? 'border-green-500 focus:border-green-500'
                                          : phoneValidationStatus === 'invalid'
                                          ? 'border-red-500 focus:border-red-500'
                                          : ''
                                      }`}
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setPhoneValidationStatus('idle');
                                        form.clearErrors('phone');
                                        const timeoutId = setTimeout(() => {
                                          checkPhoneAvailability(
                                            e.target.value
                                          );
                                        }, 500);
                                        return () => clearTimeout(timeoutId);
                                      }}
                                    />
                                    {phoneValidationStatus === 'checking' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                      </div>
                                    )}
                                    {phoneValidationStatus === 'valid' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      </div>
                                    )}
                                    {phoneValidationStatus === 'invalid' && (
                                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                      </div>
                                    )}
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
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date de naissance *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="w-full h-10"
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
                          name="adresse"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Adresse *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Votre adresse complète"
                                  className="w-full h-10"
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
                    </div>
                  )}

                  {/* Optional Information Step */}
                  {currentStep === 'optional' && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Informations Bridge (Optionnel)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Personnalisez votre profil bridge
                        </p>
                      </div>

                      <div className="space-y-4">
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
                                    <SelectTrigger className="w-full h-10">
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
                                    <SelectTrigger className="w-full h-10">
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
                                  <Input
                                    placeholder="A1234567"
                                    className="w-full h-10"
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
                            name="birthPlace"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Lieu de naissance</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Ville de naissance"
                                    className="w-full h-10"
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
                                  className="w-full h-10"
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
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    {currentStepIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Précédent</span>
                      </Button>
                    )}

                    {currentStepIndex === 0 && <div></div>}

                    {currentStepIndex === stepConfigs.length - 1 ? (
                      <Button
                        id="submit-button"
                        type="button"
                        onClick={async () => {
                          // Validate final step first
                          const isValid = await validateCurrentStep();
                          if (isValid) {
                            // Manually trigger form submission
                            const formData = form.getValues();
                            await onSubmit(formData);
                          }
                        }}
                        disabled={
                          registerMutation.isPending ||
                          fileUploadForRegistrationMutation.isPending ||
                          currentStepIndex !== stepConfigs.length - 1
                        }
                        className="flex items-center space-x-2 bg-accent hover:bg-accent/90"
                      >
                        {registerMutation.isPending ||
                        fileUploadForRegistrationMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Création du compte...</span>
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
                        id="next-button"
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
