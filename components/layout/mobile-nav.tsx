'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sling as Hamburger } from 'hamburger-react';
import { Home, Search, Bell } from 'lucide-react';

function AuthNavLinks({ onLinkClick }: { onLinkClick: () => void }) {
  return (
    <div className="flex w-full flex-col items-end justify-end pt-10 text-right">
      <Link
        href="/dashboard"
        className="flex items-center gap-4 py-3 text-3xl font-semibold"
        onClick={onLinkClick}
      >
        Dashboard <Home />
      </Link>
      <Link
        href="/explore"
        className="flex items-center gap-4 py-3 text-3xl font-semibold"
        onClick={onLinkClick}
      >
        Explore <Search />
      </Link>
      <Link
        href="/notifications"
        className="flex items-center gap-4 py-3 text-3xl font-semibold"
        onClick={onLinkClick}
      >
        Notifications <Bell />
      </Link>
    </div>
  );
}

export default function MobileNav({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const menuVariants = {
    hidden: { opacity: 0, transition: { duration: 0.2 } },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative">
      <div className="relative z-50">
        <Hamburger toggled={isOpen} toggle={setOpen} size={24} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="bg-background fixed inset-0 z-40 flex flex-col items-end justify-between p-6 pt-10"
          >
            <AuthNavLinks onLinkClick={() => setOpen(false)} />

            <div
              className="flex w-full flex-col items-start gap-2"
              onClick={() => setOpen(false)}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
