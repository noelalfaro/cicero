'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useId } from 'react';

type TextMorphProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  capitalize?: boolean;
  isLoginButton?: boolean | undefined;
};

export function TextMorph({
  children,
  as: Component = 'span',
  className,
  style,
  capitalize,
  isLoginButton,
}: TextMorphProps) {
  const uniqueId = useId();

  // Build the text based on "capitalize"
  const processedString = useMemo(() => {
    if (!children) return '';
    if (!capitalize) return children;
    return children
      .split(' ')
      .map((word) =>
        word ? word.charAt(0).toUpperCase() + word.slice(1) : word,
      )
      .join(' ');
  }, [children, capitalize]);

  // Split into characters with stable IDs
  const characters = useMemo(() => {
    const charCounts: Record<string, number> = {};
    return processedString.split('').map((char) => {
      const lowercaseChar = char.toLowerCase();
      charCounts[lowercaseChar] = (charCounts[lowercaseChar] || 0) + 1;

      return {
        id: `${uniqueId}-${lowercaseChar}${charCounts[lowercaseChar]}`,
        label: char === ' ' ? '\u00A0' : char,
      };
    });
  }, [processedString, uniqueId]);

  return (
    <Component
      className={cn(className, { 'font-login': isLoginButton })}
      aria-label={processedString}
      style={style}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {characters.map((character) => (
          <motion.span
            key={character.id}
            layoutId={character.id}
            className="inline-block"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 18,
              mass: 0.3,
            }}
          >
            {character.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </Component>
  );
}
