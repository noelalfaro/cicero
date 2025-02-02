'use client';
import { MorphButton } from '@/components/auth/morph-button';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface LoginButtonProps {
  isHomePage?: boolean;
  initialText?: string;
}
export function LoginButton({ isHomePage }: LoginButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Login');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonText('Loading...');
    try {
      router.push(`/login`);
    } catch (error) {
      console.error(error);
    }
    // You could handle any login logic here
  };
  return (
    <form onSubmit={onSubmit}>
      <MorphButton
        text={buttonText}
        setButtonText={setButtonText}
        variant="default"
        type="submit"
        isHomePage={isHomePage}
      />
    </form>
  );
}
