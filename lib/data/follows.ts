import 'server-only';
import { db } from '@/server/db';
import { follows } from '@/server/db/schema/follows';
import { and, count, eq } from 'drizzle-orm';

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

export async function getFollowerCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.following_id, userId));
  return result[0]?.count ?? 0;
}

export async function getFollowingCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(follows)
    .where(eq(follows.follower_id, userId));
  return result[0]?.count ?? 0;
}

export async function isFollowedBy(
  userId: string,
  viewerId: string,
): Promise<boolean> {
  const result = await db
    .select()
    .from(follows)
    .where(and(eq(follows.follower_id, userId), eq(follows.following_id, viewerId)))
    .limit(1);
  return result.length > 0;
}
