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

      {/* <div className="bg-card w-full max-w-2xl rounded-lg border p-6 shadow-lg sm:p-8">
      <div className="">
        <h2 className="text-foreground text-left text-4xl font-bold tracking-tight">
          Complete Your Profile
        </h2>
        <p className="text-muted-foreground my-2 text-left text-sm">
          Step {step} of 3: {step === 1 && 'Profile Essentials'}
          {step === 2 && 'Personal Details'}
          {step === 3 && 'Preferences & Socials'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {step === 1 && (
            <div className="m-0">
              <FormField
                control={form.control}
                name="picture"
                render={({ field }) => (
                  <>
                    <FormItem className="flex flex-col items-center justify-end">
                      <FormLabel className="flex self-start">
                        Profile Picture
                      </FormLabel>
                      <FormControl>
                        <CustomUpload
                          currentImageUrl={field.value}
                          altText="Profile picture preview"
                          onUploadComplete={(url) => field.onChange(url)}
                        />
                      </FormControl>
                      <div className="h-5">
                        <FormMessage />
                      </div>
                    </FormItem>
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel htmlFor="username" className="my-1">
                        Username
                      </FormLabel>
                      <AvailabilityBadge availability={isUsernameAvailable} />
                    </div>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="justakidfromakron"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsernameForCheck(e.target.value);
                          if (e.target.value.length >= 3)
                            setIsUsernameAvailable('loading');
                          else setIsUsernameAvailable('null');
                        }}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hometown"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="hometown">Hometown</FormLabel>
                    <FormControl>
                      <Input
                        id="hometown"
                        placeholder="e.g., Chicago, Illinois"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="age">Age (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 25"
                        value={
                          field.value === null || field.value === undefined
                            ? ''
                            : String(field.value)
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(val === '' ? null : parseInt(val, 10));
                        }}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="favorite_team"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="favorite_team">
                      Favorite NBA Team (Optional)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger id="favorite_team">
                          <SelectValue placeholder="Select your favorite team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {nbaTeams.map((team) => (
                          <SelectItem key={team} value={team}>
                            {team}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="goat">
                      Who's your GOAT? (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="goat"
                        placeholder="e.g., LeBron James"
                        value={field.value ?? ''}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="social_platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Social Platform (Optional)
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap gap-2">
                        {socialPlatforms.map((platform) => (
                          <Toggle
                            key={platform}
                            pressed={field.value === platform}
                            onPressedChange={(pressed) => {
                              field.onChange(pressed ? platform : null);
                              if (!pressed) {
                                form.setValue('social_handle', '');
                              }
                            }}
                            variant="outline"
                            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                          >
                            {platform}
                          </Toggle>
                        ))}
                      </div>
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="social_handle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Social Handle
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.watch('social_platform')
                            ? 'Enter handle (without @)'
                            : 'Select a platform first'
                        }
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={!form.watch('social_platform')}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}

          {submissionStatus.type === 'error' && (
            <p className="text-destructive text-sm font-medium">
              {submissionStatus.message}
            </p>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((prev) => prev - 1)}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            ) : (
              <MorphButton
                text="Complete Profile"
                variant="default"
                type="submit"
                isLoading={submissionStatus.type === 'loading'}
                isAvailable={isUsernameAvailable}
              />
            )}
          </div>
        </form>
      </Form>
    </div> */}
    </>
  );
}
