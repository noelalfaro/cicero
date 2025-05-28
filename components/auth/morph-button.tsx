'use client';
import { useState } from 'react';
import { TextMorph } from '@/components/ui/text-morph';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import clsx from 'clsx';

interface MorphButtonProps {
  text: string;
  setButtonText?: (text: string) => void;
  variant: 'default' | 'secondary' | 'outline';
  icon?: 'google' | 'github';
  isLoading?: boolean;
  isHomePage?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  isAvailable?: 'true' | 'false' | 'loading' | 'null';
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
}: MorphButtonProps) {
  const getIcon = () => {
    switch (icon) {
      case 'google':
        return <FaGoogle size={32} />;
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
        'flex w-full items-center gap-2 p-6 text-base transition-colors',
        isHomePage ? 'w-full md:w-[120px]' : 'md:w-full',
      )}
      type={type}
      disabled={
        isLoading ||
        isAvailable === 'false' ||
        isAvailable === 'loading' ||
        isAvailable === 'null'
      }
    >
      <TextMorph>{text}</TextMorph>
      {icon && getIcon()}
    </Button>
  );
}
