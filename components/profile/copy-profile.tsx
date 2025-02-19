'use client';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const CopyProfile = ({
  profile,
}: {
  profile: string | null | undefined;
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleCopyClick = async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);

        // alert('Profile URL copied to clipboard!'); // Optional: Provide feedback to the user
      } catch (err) {
        console.error('Failed to copy: ', err);
        // alert('Failed to copy profile URL to clipboard.'); // Optional: Handle errors
      }
    };

    return () => {
      handleCopyClick();
    };
  }, []);

  return (
    <Button
      variant={'ghost'}
      onClick={() => {
        toast({
          title: 'Profile URL copied to clipboard!',
          // description: 'You can now share your profile with others.',
        });
      }}
    >
      <Copy />
    </Button>
  );
};
