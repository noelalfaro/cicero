import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidateUserProfile } from '@/app/(main)/actions/actions';
import { NextRequest } from 'next/server';

const f = createUploadthing();

// Replace this with your actual authentication logic
const auth = async (req: NextRequest) => {
  try {
    // Get the Kinde server session
    console.log(req);

    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();

    // Check if the user is authenticated
    if (!isAuthenticated()) {
      throw new UploadThingError('User is not authenticated');
    }

    // Return the authenticated user
    return user;
  } catch (error) {
    console.log(error);
    throw new UploadThingError('Authentication failed');
  }
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  profilePicture: f({ image: { maxFileSize: '4MB' } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // console.log(req.body);
      // const result = await auth(req);
      const user = await auth(req as unknown as NextRequest);

      console.log(user);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError('Unauthorized');
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.url);

      const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
      const db = drizzle(sql);

      // Update the user's profile picture URL in the database
      await db
        .update(users)
        .set({ picture: file.url })
        .where(eq(users.id, metadata.userId));

      await revalidateUserProfile();

      // Return any additional data to the client
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
