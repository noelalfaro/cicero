'use client';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export const CopyProfile = ({
  profile,
}: {
  profile: string | null | undefined;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast('Profile URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy profile URL to clipboard.');
    }
  };

  return (
    <Button variant={'ghost'} onClick={handleCopyClick}>
      <Copy />
    </Button>
  );
};
