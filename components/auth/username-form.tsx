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
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDebounce } from 'use-debounce';
import AvailabilityBadge from '@/components/auth/availability-badge';

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

export default function UsernameForm({
  userId,
  initialUsername,
}: {
  userId: string;
  initialUsername: string | null | undefined;
}) {
  const [username, setUsername] = useState(initialUsername || '');
  const [debouncedUsername] = useDebounce(username, 500);
  const [isAvailable, setIsAvailable] = useState<
    'true' | 'false' | 'loading' | 'null' | 'initial'
  >('null');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: initialUsername || '',
    },
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
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
      const response = await fetch('/api/users/check-username-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      setIsAvailable(data.isAvailable ? 'true' : 'false');
    };

    if (debouncedUsername.length >= 3) {
      checkAvailability(debouncedUsername);
    } else {
      setIsAvailable('null');
    }
  }, [debouncedUsername]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/users/update-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: values.username, userId }),
      });

      if (response.ok) {
        // Update onboarding status to true
        await fetch('/api/users/update-onboarding-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, onboarding_status: true }),
        });

        if (response.ok) {
          // Redirect to dashboard after successful onboarding
          router.push('/dashboard');
        }
      } else {
        console.error('Failed to update username');
      }
    } catch (error) {
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
