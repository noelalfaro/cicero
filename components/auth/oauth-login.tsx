'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MorphButton } from '@/components/auth/morph-button';

interface OAuthLoginProps {
  provider: 'google' | 'github';
  connectionId: string;
}

export function OAuthLogin({ provider, connectionId }: OAuthLoginProps) {
  const [buttonText, setButtonText] = useState(`Continue with`);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonText('Loading...');
    try {
      console.log('Trying to reach api auth route with social...');
      window.location.href = `/api/auth/login?connection_id=${connectionId}`;
    } catch (error) {
      // Reset text if something fails
      console.log(error);
      setButtonText(`Continue with`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MorphButton
        text={buttonText}
        setButtonText={setButtonText}
        variant="outline"
        icon={provider}
        type="submit"
      />
    </form>
  );
}
