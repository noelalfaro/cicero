'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { useDebounce } from 'use-debounce';
import { handleError } from '@/lib/error/handle';

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AvailabilityBadge from '@/components/auth/availability-badge';
import { MorphButton } from '@/components/auth/morph-button';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('This is not a valid email format.')
    .transform((email) => email.trim().toLowerCase()),
});

export const EmailRegister = (props: {
  emailConnectionId: string | undefined;
}) => {
  const [emailInputValue, setEmailInputValue] = useState('');
  const [debouncedEmail] = useDebounce(emailInputValue, 1000);
  const [isEmailAvailable, setIsEmailAvailable] = useState<
    'true' | 'false' | 'loading' | 'null'
  >('null');
  const [buttonText, setButtonText] = useState('Register Via Email');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const checkEmailAvailability = async (emailToCheck: string) => {
      if (
        !emailToCheck ||
        !z.string().email().safeParse(emailToCheck).success
      ) {
        setIsEmailAvailable('null');
        return;
      }

      setIsEmailAvailable('loading');
      try {
        const response = await fetch('/api/users/check-email-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToCheck }),
          signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || `Server error: ${response.status}`,
          );
        }

        const data = await response.json();
        setIsEmailAvailable(data.isAvailable ? 'true' : 'false');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Email availability check aborted');
          return;
        }
        console.error('Error checking email availability:', error);
        setIsEmailAvailable('false');
      }
    };

    if (debouncedEmail.length > 3 && debouncedEmail.includes('@')) {
      checkEmailAvailability(debouncedEmail);
    } else {
      setIsEmailAvailable('null');
    }

    return () => {
      controller.abort();
    };
  }, [debouncedEmail]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isEmailAvailable !== 'true') {
      form.setError('email', {
        type: 'manual',
        message:
          isEmailAvailable === 'false'
            ? 'This email is already taken. Try logging in.'
            : 'Please wait for email availability check or enter a valid email.',
      });
      return;
    }

    setIsSubmitting(true);
    setButtonText('Loading...');
    try {
      console.log('Proceeding to Kinde registration with email:', values.email);
      window.location.href = `/api/auth/register?connection_id=${props.emailConnectionId}&login_hint=${values.email}`;
    } catch (error) {
      handleError('Registration Failed', error);
      setIsSubmitting(false);
      setButtonText('Register Via Email');
    }
  };

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
                  <div className="center flex h-7 w-full gap-2 text-center align-middle">
                    <Label htmlFor="email" className="leading-loose">
                      Email
                    </Label>
                    {emailInputValue && (
                      <AvailabilityBadge availability={isEmailAvailable} />
                    )}
                  </div>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="example@example.com"
                      type="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setEmailInputValue(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MorphButton
              text={buttonText}
              variant="default"
              type="submit"
              isLoading={isSubmitting}
              isAvailable={isEmailAvailable}
            />
          </form>
        </Form>
      </div>
      <div className="text-muted-foreground flex w-full flex-row flex-wrap items-center justify-center gap-2 text-xs">
        <Separator orientation="horizontal" className="w-1/3"></Separator>
        <p className="w-fit">OR</p>
        <Separator orientation="horizontal" className="w-1/3"></Separator>
      </div>
    </>
  );
};
