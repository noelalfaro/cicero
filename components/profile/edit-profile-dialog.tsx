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
import { useForm } from 'react-hook-form'; // React Hook Form
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
import { updateUserProfile } from '@/app/(main)/actions/updateUserProfile'; // Server Action
import { useState } from 'react';
import { CustomUpload } from '@/components/profile/custom-upload';
import { revalidateUserProfile } from '@/app/(main)/actions/actions';

export const EditProfileDialog = ({ user }: { user: User }) => {
  // --- Step 1: Add state to keep track of the NEW image URL
  // This state will store the URL that CustomUpload provides
  const [newProfileImageUrl, setNewProfileImageUrl] = useState<
    string | undefined
  >(undefined);
  // --- End Step 1 ---

  // Assuming updateUserFormSchema now includes a 'picture' field, e.g., picture: z.string().url().optional()
  const form = useForm<z.infer<typeof updateUserFormSchema>>({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      id: user.id,
      display_name: user.display_name || '',
      // --- Step 2: Set the initial default for the 'picture' field in React Hook Form
      // It should be the user's current picture, or undefined if none
      picture: user.picture || undefined,
    },
  });

  const [open, setOpen] = useState(false);

  async function onSubmit(values: z.infer<typeof updateUserFormSchema>) {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      // Check for null/undefined and convert to string for FormData
      formData.append(
        key,
        value !== null && value !== undefined ? String(value) : '',
      );
    });

    // --- Step 3: Add the NEW image URL to the FormData if it's available
    // The 'newProfileImageUrl' state will hold the URL from CustomUpload's callback
    if (newProfileImageUrl) {
      formData.append('picture', newProfileImageUrl);
    }
    // --- End Step 3 ---

    await updateUserProfile(formData); // This is your Server Action
    setOpen(false); // Close dialog on submit
    // Optional: After successful submission, you might want to revalidate data if user.picture isn't automatically updated
    // revalidateUserProfile(); // Assuming you have a server action for this
  }

  // --- Step 4: Define the callback function to handle the URL from CustomUpload
  const handleUploadComplete = async (url: string) => {
    // When CustomUpload calls this function, it gives us the new URL
    setNewProfileImageUrl(url); // Update our local state
    // We also want to update the form's state, as 'picture' is likely part of the schema
    form.setValue('picture', url, { shouldValidate: true, shouldDirty: true });
    await revalidateUserProfile();
  };
  // --- End Step 4 ---

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

            {/* --- Step 5: Pass the necessary props to CustomUpload --- */}
            <CustomUpload
              currentImageUrl={newProfileImageUrl || user.picture} // Pass the newly uploaded image if available, else user's current pic
              altText={`${user.username || 'User'}'s profile picture`} // Robust alt text
              onUploadComplete={handleUploadComplete} // Pass the callback handler
            />
            {/* --- End Step 5 --- */}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full flex-col space-y-6 text-start"
              >
                {/*
                  Optional: If 'picture' is a field in your schema, you might render it as a hidden input.
                  This ensures React Hook Form tracks it.
                */}

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
