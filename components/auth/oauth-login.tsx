'use client';
import { useState, FormEvent } from 'react';
import { MorphButton } from '@/components/auth/morph-button';
import { authClient } from '@/lib/auth-client';

export function OAuthLogin() {
  const [buttonText, setButtonText] = useState('Continue with Google');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonText('Loading...');
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      });
    } catch (error) {
      console.error(error);
      setButtonText('Continue with Google');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MorphButton
        text={buttonText}
        setButtonText={setButtonText}
        variant="outline"
        icon="google"
        isHomePage={false}
        type="submit"
        isLoginButton
      />
    </form>
  );
}
