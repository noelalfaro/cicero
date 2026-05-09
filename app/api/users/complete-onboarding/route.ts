import { completeOnboardingUpdate } from '@/lib/data/users';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';

const onboardingSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long.')
    .max(20, 'Username must not exceed 20 characters.')
    .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers.')
    .transform((u) => u.trim()),
  hometown: z.string().optional().nullable(),
  favorite_team: z.string().optional().nullable(),
  goat: z.string().optional().nullable(),
  picture: z
    .string()
    .url('Invalid URL format for picture.')
    .transform((url) => url.replace(/=s\d+-c$/, '=s400-c')),
  social_platform: z
    .enum(['X (Twitter)', 'Threads', 'BlueSky'])
    .optional()
    .nullable(),
  social_handle: z.string().optional().nullable(),
  age: z
    .number()
    .int('Age must be an integer.')
    .min(1, 'Age must be at least 1.')
    .optional()
    .nullable(),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = onboardingSchema.parse(body);

    await completeOnboardingUpdate(session.user.id, data);
    revalidatePath('/dashboard');

    return NextResponse.json(
      { message: 'Onboarding completed' },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.issues },
        { status: 400 },
      );
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const pgError = error as { code?: string };
      if (pgError.code === '23505') {
        return NextResponse.json(
          { message: 'Username already taken' },
          { status: 400 },
        );
      }
    }

    console.error('[complete-onboarding]', error);
    return NextResponse.json(
      { message: 'Internal server error during onboarding.' },
      { status: 500 },
    );
  }
}
