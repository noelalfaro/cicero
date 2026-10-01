import { ComingSoonNotice } from '@/components/coming-soon';

export default async function NotificationsPage() {
  return (
    <ComingSoonNotice
      title="Notifications"
      description="Alerts for follows, price moves, and activity will show up here. Coming soon."
    />
  );
}
