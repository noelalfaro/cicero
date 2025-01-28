'use client';

import { useState } from 'react';
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
import AvailabilityBadge from '@/components/auth/availability-badge';

const formSchema = z.object({
  email: z
    .string()
    .email('This is not a valid email.')
    .transform((email) => email.trim().toLowerCase())
    .refine(async (email) => {
      const response = await fetch('/api/users/check-email-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data.isAvailable;
    }, 'This email already has an account, try logging in instead.'),
});

export const EmailRegister = (props: {
  emailConnectionId: string | undefined;
}) => {
  const [email, setEmail] = useState('');
  const [isAvailable, setIsAvailable] = useState<
    'true' | 'false' | 'loading' | 'null'
  >('null');
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsAvailable('loading');
      const response = await fetch('/api/users/check-email-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      setIsAvailable(data.isAvailable ? 'true' : 'false');

      if (data.isAvailable) {
        console.log(values);
        // Handle form submission logic here
        router.push(
          `/api/auth/register?connection_id=${props.emailConnectionId}&login_hint=${values.email}`,
        );
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setIsAvailable('false');
      // Handle error (e.g., show error message to user)
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="center flex h-7 w-full gap-1 text-center align-middle">
                  <Label htmlFor="email" className="leading-loose">
                    Email
                  </Label>
                  <AvailabilityBadge availability={isAvailable} />
                </div>

                <FormControl>
                  <Input
                    id="email"
                    placeholder="example@example.com"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setEmail(e.target.value);
                      setIsAvailable('null'); // Reset availability state when user is typing
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Register</Button>
        </form>
      </Form>
    </div>
  );
};
