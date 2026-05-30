'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { follow, unfollow } from '@/app/(main)/actions/followActions';

export function FollowButton({
  followeeId,
  initialIsFollowing,
}: {
  followeeId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const prev = isFollowing;
    setIsFollowing(!prev);
    startTransition(async () => {
      try {
        if (prev) {
          await unfollow(followeeId);
        } else {
          await follow(followeeId);
        }
      } catch {
        setIsFollowing(prev);
      }
    });
  }

  return (
    <Button className="w-11/12" onClick={handleClick} disabled={isPending}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
}
