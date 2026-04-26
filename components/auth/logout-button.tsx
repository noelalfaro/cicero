'use client';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function LogoutButton({
  variant = 'destructive',
  className,
  children,
}: {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Button
      variant={variant}
      className={className}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => router.push('/'),
          },
        });
      }}
    >
      {children ?? 'Logout'}
    </Button>
  );
}
