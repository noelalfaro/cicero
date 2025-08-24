'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Sling as Hamburger } from 'hamburger-react';

// We'll keep the links defined here for clarity.
function StaticNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="flex w-full flex-col items-end justify-end pt-10 text-right">
      <Link
        href="/about-us"
        className="py-3 text-center text-3xl font-semibold underline"
        onClick={onLinkClick}
      >
        About Us
      </Link>
      <Link
        href="/learn"
        className="py-3 text-center text-3xl font-semibold underline"
        onClick={onLinkClick}
      >
        Learn
      </Link>
      <Link
        href="/blog"
        className="py-3 text-center text-3xl font-semibold underline"
        onClick={onLinkClick}
      >
        Blog
      </Link>
    </div>
  );
}

export default function AnimatedMobileNav() {
  const [isOpen, setOpen] = useState(false);

  // Animation variants for the menu container
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05, // This will animate the links one by one
      },
    },
  };

  return (
    <div className="relative">
      {/* The Hamburger Icon */}
      <div className="relative z-50">
        <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
      </div>

      {/* The Animated Menu using AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-background fixed inset-0 z-40 flex flex-col items-end justify-between p-6 pt-10"
          >
            <StaticNavLinks onLinkClick={() => setOpen(false)} />

            <div className="flex w-full flex-col items-start gap-2">
              <Link
                href="https://github.com/noelalfaro/cicero"
                className="underline"
              >
                GitHub
              </Link>
              <Link href="https://x.com/prospect_io" className="underline">
                Find us on X
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
