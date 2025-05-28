// lib/error/handle.ts
// For client-side only
import { toast } from 'sonner'; // Assuming you have sonner installed and configured
// import { Toaster } from '@/components/ui/toaster';
import { parseError } from './parse';

export const handleError = (
  title: string,
  error: unknown,
  options?: {
    // You can add more options for sonner if needed
    toastId?: string | number;
  },
): void => {
  const description = parseError(error);
  console.error(`${title}:`, error); // Always log the original error for debugging
  toast.error(title, {
    description: description,
    id: options?.toastId,
    // Add other sonner options as needed
  });
};
