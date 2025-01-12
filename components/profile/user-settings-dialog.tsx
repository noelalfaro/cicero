import { User } from '@/lib/definitions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { ModeToggle } from '@/components/theme/dark-mode-toggle';

export const UserSettings = ({ user }: { user: User }) => {
  const redirectURL =
    process.env.NODE_ENV === 'production'
      ? 'https://cicero-coral.vercel.app'
      : 'http://localhost:3000';

  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-1 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-secondary/50 hover:text-secondary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
                <p className="text-xs text-muted-text">
                  Change the color theme
                </p>
              </div>

              <ModeToggle />
            </div>
          </div>
          <LogoutLink
            postLogoutRedirectURL={redirectURL}
            className="inline-block text-blue-500 underline"
          >
            <Button variant={'destructive'}>Logout</Button>
          </LogoutLink>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
