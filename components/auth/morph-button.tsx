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
  isHomePage?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
}

export function MorphButton({
  text,
  setButtonText,
  variant,
  icon,
  isHomePage,
  type,
}: MorphButtonProps) {
  // const [text, setText] = useState(initialText);

  const getIcon = () => {
    switch (icon) {
      case 'google':
        return <FaGoogle size={24} />;
      case 'github':
        return <FaGithub size={24} />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant={variant}
      // onClick={() => setText('Loading...')}
      className={clsx(
        'flex items-center gap-2 p-6 text-base transition-colors',
        isHomePage ? 'w-full md:w-[120px]' : 'md:w-full',
      )}
      type={type}
    >
      <TextMorph>{text}</TextMorph>
      {icon && getIcon()}
    </Button>
  );
}
