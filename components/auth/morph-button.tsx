'use client';
import { useState } from 'react';
import { TextMorph } from '@/components/ui/text-morph';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import clsx from 'clsx';

interface MorphButtonProps {
  initialText: string;
  variant: 'default' | 'secondary' | 'outline';
  icon?: 'google' | 'github';
  isHomePage?: boolean; // Add a prop to determine if the button is on the home page
}

export function MorphButton({
  initialText,
  variant,
  icon,
  isHomePage = false, // Default value for isHomePage
}: MorphButtonProps) {
  const [text, setText] = useState(initialText);

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
      onClick={() => setText('Loading...')}
      className={clsx(
        'flex items-center gap-2 p-6 text-base transition-colors',
        isHomePage ? 'w-[120px]' : 'w-full',
      )}
    >
      <TextMorph>{text}</TextMorph>
      {icon && getIcon()}
    </Button>
  );
}
