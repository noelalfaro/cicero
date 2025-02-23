import { CopyProfile } from '@/components/profile/copy-profile';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MoreVertical, ShieldX, UserCheck } from 'lucide-react';
import { User } from '@/lib/definitions';

export default function UserDialog({ user }: { user: User }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-1 py-2 text-sm font-medium text-foreground ring-offset-background transition-colors hover:bg-secondary/50 hover:text-secondary-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
        <MoreVertical />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="">{user.username}'s Account</DialogTitle>
          <DialogDescription>Follow, Share, Block.</DialogDescription>
          <div className="grid w-full gap-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="follow" className="mb-1 text-right">
                  Follow
                </Label>
                <p className="text-xs text-muted-text">
                  Follow @{user.username}
                </p>
              </div>
              <Button variant={'ghost'}>
                <UserCheck />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="share" className="mb-1 text-right">
                  Share
                </Label>
                <p className="text-xs text-muted-text">
                  Copy link to {user.username}'s profile.
                </p>
              </div>
              <CopyProfile profile={user.username} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-start">
                <Label htmlFor="block" className="mb-1 text-right">
                  Block
                </Label>
                <p className="text-xs text-muted-text">Block this account.</p>
              </div>
              <Button variant={'ghostdestructive'}>
                <ShieldX />
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
