'use client';

import { User } from '@/lib/definitions';
import { updateUserFormSchema } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateUserProfile } from '@/app/(main)/actions/updateUserProfile';
import { useState } from 'react';
import { CustomUpload } from '@/components/profile/custom-upload';

export const EditProfileDialog = ({ user }: { user: User }) => {
  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      id: user.id,
      display_name: user.display_name || '',
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    await updateUserProfile(formData);
    setOpen(false);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex w-11/12 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-secondary/50 hover:text-secondary-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          Edit Profile
        </DialogTrigger>
        <DialogContent className="text-start sm:max-w-[425px]">
          <DialogHeader className="text-start">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Change details about your profile
            </DialogDescription>

            <CustomUpload user={user} />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col space-y-6 text-start"
              >
                <FormField
                  control={form.control}
                  name="display_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Best GM" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between gap-1">
                  <Button
                    variant={'ghostdestructive'}
                    onClick={() => setOpen(false)}
                    type="reset"
                    className="w-1/2"
                  >
                    Cancel
                  </Button>
                  <Button variant={'default'} type="submit" className="w-1/2">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
