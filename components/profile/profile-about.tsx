import { User } from '@/lib/definitions';

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function ProfileAbout({ user }: { user: User }) {
  const social =
    user.social_handle &&
    (user.social_platform
      ? `${user.social_platform}: @${user.social_handle.replace(/^@/, '')}`
      : `@${user.social_handle.replace(/^@/, '')}`);

  const fields = [
    user.bio ? { label: 'Bio', value: user.bio } : null,
    user.favorite_team
      ? { label: 'Favorite team', value: user.favorite_team }
      : null,
    user.goat ? { label: 'GOAT', value: user.goat } : null,
    user.hometown ? { label: 'Hometown', value: user.hometown } : null,
    social ? { label: 'Social', value: social } : null,
  ].filter((field): field is { label: string; value: string } => field !== null);

  if (fields.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No profile details yet.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {fields.map((field) => (
        <ProfileField key={field.label} label={field.label} value={field.value} />
      ))}
    </div>
  );
}
