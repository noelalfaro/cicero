'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDebounce } from 'use-debounce';
import AvailabilityBadge from '@/components/auth/availability-badge';
import { MorphButton } from '@/components/auth/morph-button';

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

const formSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers')
    .transform((username) => username.trim()),
});

export default function OnboardingForm({
  userId,
  connectionId,
}: {
  userId: string;
  connectionId?: string | null;
}) {
  const [username, setUsername] = useState('');
  const [debouncedUsername] = useDebounce(username, 1500);
  const [isAvailable, setIsAvailable] = useState<
    'true' | 'false' | 'loading' | 'null'
  >('loading');
  const [buttonText, setButtonText] = useState('Submit');

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const checkAvailability = async (username: string) => {
      const regex = /^[a-zA-Z0-9]+$/;

      if (
        !regex.test(username) ||
        reservedRoutes.includes(username.toLowerCase())
      ) {
        setIsAvailable('false');
        return;
      }

      setIsAvailable('loading');

      try {
        const response = await fetch('/api/users/check-username-availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
          signal, // Attach the AbortController signal
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();
        setIsAvailable(data.isAvailable ? 'true' : 'false');
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // Request was aborted, do nothing
            return;
          }
          console.error('Error checking username availability:', error.message);
        } else {
          console.error(
            'Unexpected error checking username availability:',
            error,
          );
        }
        setIsAvailable('false'); // Optionally set to 'false' or handle differently
      }
    };

    if (debouncedUsername.length >= 3) {
      checkAvailability(debouncedUsername);
    } else {
      setIsAvailable('null');
    }

    // Cleanup function to abort the fetch request if username changes or component unmounts
    return () => {
      controller.abort();
    };
  }, [debouncedUsername]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setButtonText('Loading...');
      const response = await fetch('/api/users/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          userId,
          connectionId,
        }),
      });

      if (response.ok) {
        // Update onboarding status to true
        const response = await fetch('/api/users/update-onboarding-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            onboarding_status: true,
          }),
        });

        if (response.ok) {
          // Redirect to dashboard after successful onboarding
          router.push('/dashboard');
        } else {
          console.error('Failed to update onboarding status');
        }
      } else {
        console.error('Failed to update username');
      }
    } catch (error) {
      setButtonText('Submit');
      console.error('Error during username update:', error);
    }
  };

  return (
    <div className="grid gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="center flex h-7 w-full gap-1 text-center align-middle">
                  <Label htmlFor="username" className="leading-loose">
                    Username
                  </Label>
                  <AvailabilityBadge availability={isAvailable} />
                </div>

                <FormControl>
                  <Input
                    id="username"
                    placeholder="justakidfromakron"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                      setIsAvailable('loading'); // Set to loading state when user is typing
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <MorphButton
            text={buttonText}
            setButtonText={setButtonText}
            variant="default"
            type="submit"
            isAvailable={isAvailable}
          />
          {/* <Button
            type="submit"
            disabled={
              isAvailable === 'false' ||
              isAvailable === 'loading' ||
              isAvailable === 'null'
            }
          >
            Submit
          </Button> */}
        </form>
      </Form>
    </div>
  );
}
