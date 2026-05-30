import 'server-only';
import { db } from '@/server/db';
import { follows } from '@/server/db/schema/follows';
import { and, eq } from 'drizzle-orm';

export async function followUser(followerId: string, followingId: string) {
  await db.insert(follows).values({ follower_id: followerId, following_id: followingId });
}

export async function unfollowUser(followerId: string, followingId: string) {
  await db
    .delete(follows)
    .where(
      and(eq(follows.follower_id, followerId), eq(follows.following_id, followingId)),
    );
}

export async function isFollowing(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(follows)
    .where(
      and(eq(follows.follower_id, followerId), eq(follows.following_id, followingId)),
    )
    .limit(1);
  return result.length > 0;
}
