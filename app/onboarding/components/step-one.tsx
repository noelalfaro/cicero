import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomUpload } from '@/components/profile/custom-upload';
import { OnboardingFormValues } from '@/components/auth/onboarding-form';
import { UseFormReturn } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AvailabilityBadge from '@/components/auth/availability-badge';

interface StepOneProps {
  form: UseFormReturn<OnboardingFormValues>;
  isUsernameAvailable: 'true' | 'false' | 'loading' | 'null';
  onNext: () => void;
  onUsernameChange: (value: string) => void;
}

export function StepOne({
  form,
  onNext,
  isUsernameAvailable,
  onUsernameChange,
}: StepOneProps) {
  return (
    <>
      <Card className="gap-2 p-6">
        <h2 className="mb-4 text-2xl font-bold">Profile Essentials</h2>
        <div className="space-y-5">
          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CustomUpload
                    currentImageUrl={field.value}
                    altText={field.value ?? ''}
                    onUploadComplete={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormLabel className="text-muted-text mt-2 text-center text-xs">
                  Hover or Drag & Drop to Update Profile Picture
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel htmlFor="username" className="my-1">
                    Username
                  </FormLabel>
                  <AvailabilityBadge availability={isUsernameAvailable} />
                </div>
                <FormControl>
                  <Input
                    id="username"
                    placeholder="justakidfromakron"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      onUsernameChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={onNext}
              className="w-full p-6 text-base"
              disabled={
                isUsernameAvailable === 'false' ||
                isUsernameAvailable === 'loading' ||
                isUsernameAvailable === 'null'
              }
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
