'use client';
import { MorphButton } from '@/components/auth/morph-button';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
interface RegisterButtonProps {
  isHomePage?: boolean;
  initialText?: string;
}
export function RegisterButton({ isHomePage = false }: RegisterButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState('Register');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setButtonText('Loading...');
    try {
      router.push(`/register`);
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
        variant="secondary"
        type="submit"
        isHomePage={isHomePage}
      />
    </form>
  );
}
