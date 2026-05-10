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
import { Textarea } from '@/components/ui/textarea';
import { updateUserProfile } from '@/app/(main)/actions/updateUserProfile';
import { useState } from 'react';
import { CustomUpload } from '@/components/profile/custom-upload';
import { revalidateUserProfile } from '@/app/(main)/actions/actions';

export const EditProfileDialog = ({ user }: { user: User }) => {
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<
    string | undefined
  >(undefined);

  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      id: user.id,
      display_name: user.display_name || '',
      picture: user.picture || undefined,
      bio: user.bio || '',
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(
        key,
        value !== null && value !== undefined ? String(value) : '',
      );
    });

    if (newProfileImageUrl) {
      formData.append('picture', newProfileImageUrl);
    }

    await updateUserProfile(formData);
    setOpen(false);
  }

  const handleUploadComplete = async (url: string) => {
    setNewProfileImageUrl(url);
    form.setValue('picture', url, { shouldValidate: true, shouldDirty: true });
    await revalidateUserProfile();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="border-input bg-background text-foreground ring-offset-background hover:bg-secondary/50 hover:text-secondary-foreground inline-flex w-11/12 cursor-pointer items-center justify-center rounded-md border text-sm font-medium whitespace-nowrap shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50">
          Edit Profile
        </DialogTrigger>
        <DialogContent className="text-start sm:max-w-[425px]">
          <DialogHeader className="text-start">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Change details about your profile
            </DialogDescription>

            <CustomUpload
              currentImageUrl={newProfileImageUrl || user.picture}
              altText={`${user.username || 'User'}'s profile picture`}
              onUploadComplete={handleUploadComplete}
            />

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

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell people a little about yourself..."
                          className="resize-none"
                          maxLength={160}
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormDescription>
                        {(field.value?.length ?? 0)}/160 characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between gap-1">
                  <Button
                    variant={'outline'}
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
