'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { doesEmailExistCheck } from '@/lib/data/registration';
import { Separator } from '@/components/ui/separator';
import { LoginButton } from '@/components/auth/login-button';
import { MorphButton } from '@/components/auth/morph-button';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email({ message: 'This is not a valid email.' })
    .refine(async (email) => {
      // Where checkIfEmailIsValid makes a request to the backend
      // to see if the email is valid.
      return await doesEmailExistCheck(email);
    }, "This email doesn't exist in our database, try registering first instead."),
});

export const EmailLogin = (props: {
  emailConnectionId: string | undefined;
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Login Via Email');

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setButtonText('Loading...');
    try {
      console.log('Trying to reach auth api route...');
      window.location.href = `/api/auth/login?connection_id=${props.emailConnectionId}&login_hint=${values.email}`;
    } catch (error) {
      setIsLoading(false);
      setButtonText('Login Via Email');
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
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="justakidfromakron@gmail.com"
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
            <MorphButton
              text={buttonText}
              setButtonText={setButtonText}
              variant="default"
              type="submit"
            />
          </form>
        </Form>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
        <Separator orientation="horizontal" className="w-1/4"></Separator>
        OR
        <Separator orientation="horizontal" className="w-1/4"></Separator>
      </div>
    </>
  );
};
