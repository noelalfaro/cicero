import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export const dynamic = 'force-dynamic';

const SAMPLE_PLAYERS = [
  { id: '1629029', name: 'Luka Dončić' },
  { id: '201142', name: 'Kevin Durant' },
] as const;

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  const username = user?.username;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {username ? (
          <p className="text-muted-foreground text-sm">
            Signed in as{' '}
            <Link
              href={`/users/${username}`}
              className="text-foreground font-mono hover:underline"
            >
              @{username}
            </Link>
          </p>
        ) : null}
        <p className="text-muted-foreground max-w-prose text-sm">
          Trading and portfolio tracking are not live yet. Use explore and
          player pages to browse the product while we build holdings.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Next steps</CardTitle>
          <CardDescription>
            Real paths that work today — no placeholders.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button asChild>
            <Link href="/explore">Explore players</Link>
          </Button>
          {username ? (
            <Button asChild variant="secondary">
              <Link href={`/users/${username}`}>View your profile</Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample players</CardTitle>
          <CardDescription>
            Jump into a player page to see stats and PR score.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          {SAMPLE_PLAYERS.map((player) => (
            <Button key={player.id} asChild variant="link" className="h-auto p-0">
              <Link href={`/players/${player.id}`}>{player.name}</Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>
            Your positions will show up here once trading ships. Nothing to
            manage yet.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
