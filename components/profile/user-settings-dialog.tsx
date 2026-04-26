'use client';
import { User } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MoreVertical } from 'lucide-react';
import { LogoutButton } from '@/components/auth/logout-button';
import { ModeToggle } from '@/components/theme/dark-mode-toggle';

export const UserSettings = ({ user }: { user: User }) => {
  return (
    <Dialog>
      <DialogTrigger className="border-input bg-background text-foreground ring-offset-background hover:bg-secondary/50 hover:text-secondary-foreground focus-visible:ring-ring inline-flex h-10 cursor-pointer items-center justify-center rounded-md border px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50">
        <MoreVertical />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Make changes to your Prospect Portfolio experience.
          </DialogDescription>
          <div className="grid w-full gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="theme-toggle" className="mb-1 text-right">
                  Appearence
                </Label>
                <p className="text-muted-text text-xs">
                  Change the color theme
                </p>
              </div>

              <ModeToggle />
            </div>
          </div>
          <LogoutButton>Logout</LogoutButton>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
