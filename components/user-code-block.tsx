import { User } from '@/app/(main)/lib/definitions';
import { notFound } from 'next/navigation';

export async function UserCodeBlock({ user }: { user: User }) {
  // console.log(user);
  return (
    <div className="flex w-full flex-col flex-wrap">
      <div>
        <h2 className="text-2xl font-semibold">
          Well, well, well, if it isn&apos;t...
        </h2>
        <pre className="mt-4 rounded-sm bg-background p-4 font-mono text-sm text-current">
          {!user ? notFound() : JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
