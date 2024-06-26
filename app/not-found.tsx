import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Frown />
      <Link href="/">Return Home</Link>
    </div>
  );
}
