import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers as nextHeaders } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { db } from '@/server/db';

const f = createUploadthing();

export const ourFileRouter = {
  profilePicture: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      const session = await auth.api.getSession({ headers: await nextHeaders() });
      if (!session?.user) throw new UploadThingError('Unauthorized');
      return { userId: session.user.id, username: session.user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(users)
        .set({ picture: file.ufsUrl })
        .where(eq(users.id, metadata.userId));

      revalidatePath(`/${metadata.username}`);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
