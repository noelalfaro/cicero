'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { checkIfUsernameIsValid } from '@/app/lib/data';
import { Divider } from '@mui/material';
import { setCookie } from 'cookies-next';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled' })
    .email({ message: 'This is not a valid email' }),
  username: z
    .string()
    .min(3, { message: 'username must be at least 3 characters' })
    .refine((e) => {
      // Where checkIfEmailIsValid makes a request to the backend
      // to see if the email is valid.
      return checkIfUsernameIsValid(e);
    }, 'This username is not appropriate'),
});

export const EmailRegister = (props: {
  emailConnectionId: string | undefined;
}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
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
      setCookie('temp_username', values.username, { maxAge: 300 }); // expires in 5 minutes

      // Navigate to the registration page with username as a parameter
      router.push(
        `/api/auth/register?connection_id=${props.emailConnectionId}`,
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
                      // onKeyDown={(e) => {
                      //   if (e.key === 'Enter') {
                      //     router.push(
                      //       `/api/auth/login?connection_id=${props.emailConnectionId}&login_hint=${email}`,
                      //     );
                      //   }
                      // }}
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
            {/* <RegisterLink
              authUrlParams={{
                connection_id: props.emailConnectionId!,
              }}
            > */}
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
            {/* </RegisterLink> */}
          </form>
        </Form>
        {/* <RegisterLink
          authUrlParams={{
            connection_id: props.emailConnectionId!,
          }}
        >
          <Button className="w-full" type="submit">
            Sign Up
          </Button>
        </RegisterLink> */}
      </div>
      <Divider className="text-sm text-muted-foreground">Or</Divider>
    </>
  );
};
