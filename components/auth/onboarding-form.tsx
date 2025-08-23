'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { handleError } from '@/lib/error/handle';
import z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import AvailabilityBadge from '@/components/auth/availability-badge';
import { MorphButton } from '@/components/auth/morph-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { CustomUpload } from '@/components/profile/custom-upload';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { StepOne } from '@/app/onboarding/components/step-one';
import { StepThree } from '@/app/onboarding/components/step-three';
import { StepTwo } from '@/app/onboarding/components/step-two';

const reservedRoutes = [
  'dashboard',
  'notifications',
  'explore',
  'settings',
  'register',
  'login',
  'onboarding',
  'players',
];

const nbaTeams = [
  'Atlanta Hawks',
  'Boston Celtics',
  'Brooklyn Nets',
  'Charlotte Hornets',
  'Chicago Bulls',
  'Cleveland Cavaliers',
  'Dallas Mavericks',
  'Denver Nuggets',
  'Detroit Pistons',
  'Golden State Warriors',
  'Houston Rockets',
  'Indiana Pacers',
  'LA Clippers',
  'Los Angeles Lakers',
  'Memphis Grizzlies',
  'Miami Heat',
  'Milwaukee Bucks',
  'Minnesota Timberwolves',
  'New Orleans Pelicans',
  'New York Knicks',
  'Oklahoma City Thunder',
  'Orlando Magic',
  'Philadelphia 76ers',
  'Phoenix Suns',
  'Portland Trail Blazers',
  'Sacramento Kings',
  'San Antonio Spurs',
  'Toronto Raptors',
  'Utah Jazz',
  'Washington Wizards',
];

const socialPlatforms = ['X (Twitter)', 'Threads', 'BlueSky'] as const;

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
      .transform((username) => username.trim()),
    favorite_team: z
      .string()
      .min(1, 'Please select your favorite team.')
      .optional()
      .nullable(),
    goat: z
      .string()
      .min(2, 'GOAT name too short.')
      .max(50, 'GOAT name too long.')
      .trim()
      .optional()
      .nullable(),
    picture: z
      .string()
      .url({ message: 'A valid image URL is required after upload.' })
      .optional()
      .nullable(),
    social_platform: z
      .enum(socialPlatforms, {
        errorMap: () => ({ message: 'Please select a social media platform.' }),
      })
      .optional()
      .nullable(),
    social_handle: z
      .string()
      .max(30, 'Social handle too long.')
      .regex(
        /^[a-zA-Z0-9_]*$/,
        'Handle can only contain letters, numbers, and underscores.',
      )
      .trim()
      .optional()
      .nullable(),
    age: z.coerce
      .number({ invalid_type_error: 'Age must be a number.' })
      .int('Age must be a whole number.')
      .positive('Age must be a positive number.')
      .min(13, 'You must be at least 13 years old.')
      .max(120, 'Please enter a valid age.')
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (
        data.social_platform &&
        (!data.social_handle || data.social_handle.trim() === '')
      ) {
        return false;
      }
      return true;
    },
    {
      message: 'Social handle is required when a platform is selected.',
      path: ['social_handle'],
    },
  );

export type OnboardingFormValues = z.infer<typeof formSchema>;

export default function OnboardingForm({
  userId,
  connectionId,
  defaultPicture,
}: {
  userId: string;
  connectionId?: string | null | undefined;
  defaultPicture?: string | null;
}) {
  const [step, setStep] = useState(1);
  const [usernameForCheck, setUsernameForCheck] = useState('');
  const [debouncedUsername] = useDebounce(usernameForCheck, 1500);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    'true' | 'false' | 'loading' | 'null'
  >('loading');
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'idle' | 'loading' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      favorite_team: '',
      goat: '',
      picture:
        defaultPicture ||
        'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg',
      social_platform: null,
      social_handle: '',
      age: undefined,
    },
    mode: 'onBlur',
    // reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const checkUsernameAvailability = async (usernameToTest: string) => {
      if (usernameToTest.length < 3) {
        setIsUsernameAvailable('null');
        return;
      }
      const regex = /^[a-zA-Z0-9]+$/;
      if (
        !regex.test(usernameToTest) ||
        reservedRoutes.includes(usernameToTest.toLowerCase())
      ) {
        setIsUsernameAvailable('false');
        form.setError('username', {
          type: 'manual',
          message: 'This username is not allowed.',
        });
        return;
      }
      setIsUsernameAvailable('loading');
      try {
        const response = await fetch('/api/users/check-username-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usernameToTest }),
          signal,
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Server error: ${response.statusText}`,
          );
        }
        const data = await response.json();
        setIsUsernameAvailable(data.isAvailable ? 'true' : 'false');
        if (!data.isAvailable) {
          form.setError('username', {
            type: 'manual',
            message: 'This username is already taken.',
          });
        }
      } catch (errorInstance: any) {
        if (errorInstance.name !== 'AbortError') {
          handleError('Username check failed', errorInstance);
          setIsUsernameAvailable('false');
          form.setError('username', {
            type: 'manual',
            message: 'Could not verify username.',
          });
        }
      }
    };
    if (debouncedUsername) {
      checkUsernameAvailability(debouncedUsername);
    } else {
      setIsUsernameAvailable('null');
    }
    return () => controller.abort();
  }, [debouncedUsername, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmissionStatus({ type: 'loading' });
    try {
      const payload = { userId, connectionId, ...values };
      const response = await fetch('/api/users/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete onboarding.');
      }
      router.push('/dashboard');
    } catch (error: any) {
      handleError('Onboarding submission failed', error);
      setSubmissionStatus({
        type: 'error',
        message: error.message || 'An unexpected error occurred.',
      });
    }
  };

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];
    if (step === 1) fieldsToValidate = ['username', 'picture'];
    if (step === 2)
      fieldsToValidate = ['social_handle', 'social_platform', 'age'];

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid && (step !== 1 || isUsernameAvailable === 'true')) {
      setStep((prev) => prev + 1);
    } else if (isUsernameAvailable !== 'true' && step === 1) {
      form.setError('username', {
        type: 'manual',
        message: 'Please choose an available username.',
      });
    }
  };

  const handleBackStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleUsernameChange = (value: string) => {
    setUsernameForCheck(value);
    if (value.length >= 3) {
      setIsUsernameAvailable('loading');
    } else {
      setIsUsernameAvailable('null');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-span-4 row-span-1 flex w-full justify-center md:col-start-2"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="flex w-full flex-col"
            >
              {step === 1 && (
                <StepOne
                  form={form}
                  isUsernameAvailable={isUsernameAvailable}
                  onNext={handleNextStep}
                  onUsernameChange={handleUsernameChange}
                />
              )}
              {step === 2 && (
                <StepTwo
                  form={form}
                  onNext={handleNextStep}
                  onBack={handleBackStep}
                />
              )}
              {step === 3 && (
                <StepThree
                  form={form}
                  onBack={handleBackStep}
                  isLoading={submissionStatus.type === 'loading'}
                  isUsernameAvailable={isUsernameAvailable}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </Form>
    </>
  );
}
