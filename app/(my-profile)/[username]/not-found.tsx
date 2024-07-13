import Link from 'next/link';
import { Frown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="w-full items-center">
      <h2 className="text-6xl font-semibold">
        User Not Found <Frown className="inline" size={64} />
      </h2>

      <Link href="/">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
