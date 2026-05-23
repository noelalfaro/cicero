'use client';
import { useState, FormEvent } from 'react';
import { MorphButton } from '@/components/auth/morph-button';
import { authClient } from '@/lib/auth-client';

export function OAuthLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MorphButton
        text="Continue with Google"
        variant="outline"
        icon="google"
        type="submit"
        isLoginButton
        isLoading={isLoading}
      />
    </form>
  );
}
