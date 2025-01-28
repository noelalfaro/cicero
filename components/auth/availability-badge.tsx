import { Badge } from '@/components/ui/badge';
import { TextMorph } from '@/components/ui/text-morph';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function AvailabilityBadge({
  availability,
}: {
  availability: 'true' | 'false' | 'loading' | 'null' | 'initial';
}) {
  return (
    <AnimatePresence>
      {availability !== 'null' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <Badge
            className={clsx('transition-opacity duration-300', {
              'opacity-100':
                availability === 'true' || availability === 'false',
              'opacity-50': availability === 'loading',
            })}
            variant={
              availability === 'true'
                ? 'default'
                : availability === 'loading'
                  ? 'outline'
                  : 'destructive'
            }
          >
            <TextMorph>
              {availability === 'loading'
                ? 'Loading'
                : availability === 'true'
                  ? 'Available'
                  : 'Unavailable'}
            </TextMorph>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
