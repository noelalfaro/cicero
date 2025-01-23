'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  checkIfUsernameIsInBlacklist,
  checkIfUsernameIsTaken,
  doesEmailExistCheck,
} from '@/lib/data/registration';

import { setCookie } from 'cookies-next';

const reservedRoutes = [
  'dashboard',
  'notifications',
  'explore',
  'settings',
  'register',
  'login',
];

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email({ message: 'This is not a valid email.' })
    .transform((email) => email.trim().toLowerCase())
    .refine(
      async (email) => {
        return !(await doesEmailExistCheck(email));
      },
      { message: 'This email already has an account, try logging in instead.' },
    ),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters.' })
    .transform((username) => username.trim()) // Trim whitespace
    .refine(
      async (username) => !reservedRoutes.includes(username.toLowerCase()),
      {
        message: 'This username is reserved and cannot be used.',
      },
    )
    .refine(
      async (username) => {
        return await checkIfUsernameIsInBlacklist(username);
      },
      { message: 'This username contains inappropriate language.' },
    )
    .refine(
      async (username) => {
        return !(await checkIfUsernameIsTaken(username));
      },
      { message: 'This username is already taken.' },
    ),
});

export const EmailRegister = (props: {
  emailConnectionId: string | undefined;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Set a cookie with the username
      setCookie('temp_username', values.username);
      // Navigate to the registration page with username as a parameter
      router.push(
        `/api/auth/register?connection_id=${props.emailConnectionId}&login_hint=${values.email}`,
      );
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <>
      <div className="grid gap-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="kingjames@lakers.com"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="username">Username</Label>
                  <FormControl>
                    <Input
                      id="username"
                      placeholder="justakidfromakron"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
