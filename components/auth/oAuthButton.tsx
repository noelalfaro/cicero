'use client';
import { MorphButton } from '@/components/auth/morph-button';

export function OAuthButton({ provider }: { provider: 'google' | 'github' }) {
  return (
    <MorphButton
      initialText="Continue With"
      variant="outline"
      icon={provider}
    />
  );
}
