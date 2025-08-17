'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MorphButton } from '@/components/auth/morph-button';

interface OAuthLoginProps {
  provider: 'google' | 'github';
  connectionId: string;
}

function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function OAuthRegister({ provider, connectionId }: OAuthLoginProps) {
  const [buttonText, setButtonText] = useState(
    `Sign in with ` + capitalize(provider),
  );
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonText('Loading...');
    try {
      // Redirect to your OAuth route
      window.location.href = `/api/auth/register?connection_id=${connectionId}`;
    } catch (error) {
      // Reset text if something fails
      setButtonText(`Sign in with ` + capitalize(provider));
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
