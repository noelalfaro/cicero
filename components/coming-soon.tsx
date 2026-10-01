import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ComingSoonButtonProps = Omit<ComponentProps<typeof Button>, 'disabled'> & {
  label?: string;
};

export function ComingSoonButton({
  children,
  className,
  label = 'Coming soon',
  ...props
}: ComingSoonButtonProps) {
  return (
    <Button
      type="button"
      disabled
      aria-disabled="true"
      title={label}
      className={cn(className)}
      {...props}
    >
      <span className="flex w-full items-center justify-center gap-2">
        {children}
        <span className="text-xs font-normal opacity-80">({label})</span>
      </span>
    </Button>
  );
}

export function ComingSoonNotice({
  title = 'Coming soon',
  description = 'This feature is not available yet.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
