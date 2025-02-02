'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useId } from 'react';

type TextMorphProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
};

export function TextMorph({
  children,
  as: Component = 'span',
  className,
  style,
}: TextMorphProps) {
  const uniqueId = useId();

  // 1. Pre-process the string to capitalize the first letter of each word
  const processedString = useMemo(() => {
    return children
      .split(' ')
      .map((word) => {
        // If word is empty or whitespace, return as is
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }, [children]);

  // 2. Split processedString into characters
  const characters = useMemo(() => {
    const charCounts: Record<string, number> = {};

    return processedString.split('').map((char) => {
      // Lowercase version, just for counting so keys stay consistent
      const lowercaseChar = char.toLowerCase();
      charCounts[lowercaseChar] = (charCounts[lowercaseChar] || 0) + 1;

      return {
        id: `${uniqueId}-${lowercaseChar}${charCounts[lowercaseChar]}`,
        label: char === ' ' ? '\u00A0' : char, // Replace space with a non-breaking space for layout
      };
    });
  }, [processedString, uniqueId]);

  return (
    <Component
      className={cn(className)}
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
