'use client';
import { useState } from 'react';
import { TextMorph } from '@/components/ui/text-morph';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import clsx from 'clsx';
import google from '@/public/google.svg';
import Image from 'next/image';

interface MorphButtonProps {
  text: string;
  setButtonText?: (text: string) => void;
  variant: 'default' | 'secondary' | 'outline';
  icon?: 'google' | 'github';
  isLoading?: boolean;
  isHomePage?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  isAvailable?: 'true' | 'false' | 'loading' | 'null';
  isLoginButton?: boolean | undefined;
}

export function MorphButton({
  text,
  setButtonText,
  variant,
  icon,
  isLoading,
  isHomePage,
  type,
  isAvailable,
  isLoginButton,
}: MorphButtonProps) {
  const getIcon = () => {
    switch (icon) {
      case 'google':
        return <Image src={google} alt="Google" width={32} height={32} />;
      case 'github':
        return <FaGithub size={32} />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant={variant}
      className={clsx(
        'flex w-full items-center gap-2 p-8 text-base transition-colors md:p-6',
        isHomePage ? 'w-full p-6 md:w-[120px]' : 'md:w-full',
      )}
      type={type}
      disabled={
        isLoading ||
        isAvailable === 'false' ||
        isAvailable === 'loading' ||
        isAvailable === 'null'
      }
    >
      {icon && getIcon()}
      <TextMorph isLoginButton={isLoginButton}>{text}</TextMorph>
    </Button>
  );
}
