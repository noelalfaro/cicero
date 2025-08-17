'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { doesEmailExistCheck } from '@/lib/data/registration';
import { Separator } from '@/components/ui/separator';
import { MorphButton } from '@/components/auth/morph-button';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs';

const DEMO_USERNAME = (
  process.env.NEXT_PUBLIC_DEMO_USERNAME || 'demo'
).toLowerCase();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Required')
    .refine(async (value) => {
      const raw = value.trim();
      const lower = raw.toLowerCase();
      if (!raw.includes('@')) {
        // Only allow the demo username for username/password login
        return lower === DEMO_USERNAME;
      }
      if (!emailRegex.test(raw)) return false;
      return await doesEmailExistCheck(raw);
    }, 'Enter an existing email or the demo username.'),
});

type FormValues = z.infer<typeof formSchema>;

export const EmailLogin = ({
  emailConnectionId,
  usernameConnectionId,
}: {
  emailConnectionId?: string;
  usernameConnectionId?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log('Username connection received is: ' + usernameConnectionId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { identifier: '' },
    reValidateMode: 'onSubmit',
  });

  const identifierVal = form.watch('identifier');
  const trimmed = identifierVal.trim();
  const lower = trimmed.toLowerCase();
  const isEmail = trimmed.includes('@');
  const isDemoUsername = !isEmail && lower === DEMO_USERNAME;

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const ident = values.identifier.trim();

      // DEMO LOGIN — hosted UI with pre-filled username
      if (isDemoUsername) {
        if (!usernameConnectionId)
          throw new Error('Missing username/password connection id');
        window.location.href = `/api/auth/login?connection_id=${usernameConnectionId}&login_hint=username:${encodeURIComponent(ident)}`;
        return;
      }

      // NORMAL EMAIL LOGIN — hosted UI
      if (isEmail) {
        if (!emailConnectionId) throw new Error('Missing email connection id');
        window.location.href = `/api/auth/login?connection_id=${emailConnectionId}&login_hint=${encodeURIComponent(
          ident,
        )}`;
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  const buttonLabel = isLoading
    ? isDemoUsername
      ? 'Redirecting to Demo Login...'
      : 'Redirecting...'
    : isDemoUsername
      ? 'Demo Login'
      : 'Login via Email';

  return (
    <>
      <div className="grid gap-2">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
          noValidate
        >
          <div>
            <Label htmlFor="identifier">Email</Label>
            <Input
              id="identifier"
              placeholder="you@email.com"
              {...form.register('identifier')}
              autoComplete={isEmail ? 'email' : 'username'}
            />
            {form.formState.errors.identifier && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.identifier.message}
              </p>
            )}
          </div>

          <MorphButton
            text={buttonLabel}
            variant="default"
            type="submit"
            isLoading={isLoading}
          />
        </form>
      </div>

      <div className="text-muted-foreground flex w-full flex-wrap items-center justify-center gap-2 text-xs">
        <Separator orientation="horizontal" className="w-1/3" />
        OR
        <Separator orientation="horizontal" className="w-1/3" />
      </div>
    </>
  );
};
