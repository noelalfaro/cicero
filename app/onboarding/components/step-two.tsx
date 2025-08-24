import { OnboardingFormValues } from '@/components/auth/onboarding-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { UseFormReturn } from 'react-hook-form';

interface StepTwoProps {
  form: UseFormReturn<OnboardingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

const socialPlatforms = ['X (Twitter)', 'Threads', 'BlueSky'] as const;

export function StepTwo({ form, onNext, onBack }: StepTwoProps) {
  return (
    <Card className="gap-2 p-6">
      <h2 className="mb-4 text-xl font-bold md:text-2xl">Personal Details</h2>
      <div className="space-y-5">
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 25"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Social Platform (Optional)</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {socialPlatforms.map((platform) => (
                    <Toggle
                      key={platform}
                      pressed={field.value === platform}
                      onPressedChange={(pressed) => {
                        field.onChange(pressed ? platform : null);
                        if (!pressed) {
                          form.setValue('social_handle', '');
                        }
                      }}
                      variant="outline"
                      className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      {platform}
                    </Toggle>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_handle"
          render={({ field }) => (
            <FormItem className="mb-3">
              <FormLabel>Social Handle</FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    form.watch('social_platform')
                      ? 'Enter handle (without @)'
                      : 'Select a platform first'
                  }
                  {...field}
                  value={field.value ?? ''}
                  disabled={!form.watch('social_platform')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-1/2 p-6 text-base"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={onNext}
            className="w-1/2 p-6 text-base"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
