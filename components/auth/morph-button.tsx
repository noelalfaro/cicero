'use client';
import { useState } from 'react';
import { TextMorph } from '@/components/ui/text-morph';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';

interface TextMorphButtonProps {
  login: boolean;
  provider: string;
}

export function TextMorphButton({ login, provider }: TextMorphButtonProps) {
  const [text, setText] = useState(login ? `Login with` : `Sign up with`);

  return (
    <Button
      variant={'outline'}
      onClick={() => setText('Loading...')}
      className="flex w-full items-center gap-2 p-6 text-base transition-colors"
    >
      <TextMorph>{text}</TextMorph>
      {'  '}
      {provider === 'Google' ? <FaGoogle size={32} /> : <FaGithub size={24} />}
    </Button>
  );
}

interface SimpleTextMorphButtonProps {
  login: boolean;
  isLoading: boolean;
}

export function SimpleTextMorphButton({
  login,
  isLoading,
}: SimpleTextMorphButtonProps) {
  const [text, setText] = useState(login ? 'Login' : 'Sign up');

  return (
    <Button
      variant={'default'}
      onClick={() => setText('Loading...')}
      className="flex w-full items-center gap-2 p-6 text-base transition-colors"
    >
      <TextMorph>{isLoading ? 'Loading...' : text}</TextMorph>
    </Button>
  );
}
