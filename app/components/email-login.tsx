'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
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
import { checkIfEmailIsValid } from '@/app/lib/data';
import { Divider } from '@mui/material';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled' })
    .email({ message: 'This is not a valid email' })
    .refine(async (e) => {
      // Where checkIfEmailIsValid makes a request to the backend
      // to see if the email is valid.
      return await checkIfEmailIsValid(e);
    }, 'This email is not in our database'),
});

export const EmailLogin = (props: {
  emailConnectionId: string | undefined;
}) => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    router.push(
      `/api/auth/login?connection_id=${props.emailConnectionId}&login_hint=${values.email}`,
    );
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          router.push(
                            `/api/auth/login?connection_id=${props.emailConnectionId}&login_hint=${email}`,
                          );
                        }
                      }}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <LoginLink
              authUrlParams={{
                connection_id: props.emailConnectionId!,
                login_hint: email,
              }}
            >
              <Button className="w-full" type="submit">
                Login
              </Button>
            </LoginLink>
          </form>
        </Form>
      </div>
      <Divider className="text-sm text-muted-foreground">Or</Divider>
    </>
  );
};
