import { useOnlineStatus } from '../hooks/use-online-status';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="flex items-center justify-center bg-yellow-500/90 px-4 py-2 text-sm font-medium text-foreground">
      Offline mode: some features may be limited.
    </div>
  );
}
