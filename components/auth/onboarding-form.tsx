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
    hometown: z
      .string()
      .min(3, 'Hometown must be at least 3 characters long')
      .max(20, 'Hometown must not exceed 20 characters')
      .regex(
        /^[a-zA-Z\s.-]+$/,
        'Hometown can only contain letters, spaces, dots, or hyphens.',
      ),
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
      // If a platform is selected, handle is required
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

type OnboardingFormValues = z.infer<typeof formSchema>;

export default function OnboardingForm({
  userId,
  connectionId,
  defaultPicture,
}: {
  userId: string;
  connectionId?: string | null | undefined;
  defaultPicture?: string | null;
}) {
  const [usernameForCheck, setUsernameForCheck] = useState('');
  const [debouncedUsername] = useDebounce(usernameForCheck, 1500);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    'true' | 'false' | 'loading' | 'null'
  >('loading');
  const [buttonText, setButtonText] = useState('Complete Profile');
  const [submissionStatus, setSubmissionStatus] = useState<{
    type: 'idle' | 'loading' | 'error';
    message?: string;
  }>({ type: 'idle' });

  const router = useRouter();

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      hometown: '',
      favorite_team: '',
      goat: '',
      picture:
        defaultPicture ||
        'https://i.pinimg.com/originals/25/ee/de/25eedef494e9b4ce02b14990c9b5db2d.jpg',
      social_platform: null,
      social_handle: '',
      age: undefined,
    },
    reValidateMode: 'onSubmit',
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
      } catch (errorInstance: any) {
        if (errorInstance.name !== 'AbortError') {
          handleError('Username check failed', errorInstance);
          setIsUsernameAvailable('false'); // Assume false on error
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
    try {
      setButtonText('Loading...');

      const payload = {
        userId,
        connectionId,
        username: values.username,
        hometown: values.hometown,
        favorite_team: values.favorite_team,
        goat: values.goat,
        picture: values.picture,
        social_platform: values.social_platform,
        social_handle: values.social_handle,
        age: values.age,
      };
      console.log(payload);
      const response = await fetch('/api/users/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // If the response is not ok, throw an error to be caught by the catch block
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete onboarding.');
      }
      // If we get here, it was successful!
      router.push('/dashboard');
    } catch (error: any) {
      handleError('Onboarding submission failed catastrophically', error);
      setSubmissionStatus({
        type: 'error',
        message: error.message || 'An unexpected error occurred on the client.',
      });
    }
  };

  return (
    <div className="bg-card w-full rounded-lg border p-6 shadow-lg sm:p-8">
      <h2 className="text-foreground text-left text-4xl font-bold tracking-tight">
        Complete Your Profile
      </h2>
      <p className="text-muted-foreground mb-6 text-left text-sm">
        Tell us a bit more about yourself to get started.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col lg:flex-row"
        >
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem className="w-fit items-center justify-center self-center md:w-1/2">
                <FormControl>
                  <CustomUpload
                    currentImageUrl={field.value}
                    altText="Profile picture preview"
                    onUploadComplete={(url) => {
                      field.onChange(url);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex grow flex-col gap-4 py-2">
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="favorite_team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="favorite_team">
                    Favorite NBA Team
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
                      {/* Allow unselecting or placeholder */}
                      {nbaTeams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="goat">Who's your GOAT?</FormLabel>
                  <FormControl>
                    <Input
                      id="goat"
                      placeholder="e.g., LeBron James"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
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
                              // If pressed, set the platform, if unpressed, set to null
                              field.onChange(pressed ? platform : null);
                              // Also clear the handle when platform is deselected
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
                    <FormMessage />
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
                        className={
                          !form.watch('social_platform')
                            ? 'cursor-not-allowed opacity-60'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="age">Age</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {submissionStatus.type === 'error' && (
              <p className="text-destructive text-sm font-medium">
                {submissionStatus.message}
              </p>
            )}

            <MorphButton
              text={buttonText}
              variant="default"
              type="submit"
              setButtonText={setButtonText}
              isAvailable={isUsernameAvailable}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
