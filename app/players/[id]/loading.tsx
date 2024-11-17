// components/Loading.tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import Image from 'next/image'; // Import the Image component from the correct package
import { Skeleton } from '@/components/ui/skeleton';
import { PlayerCardSkeleton } from '@/components/skeletons';

export default async function Loading() {
  return <PlayerCardSkeleton />;
}
