import { useEffect } from 'react';
import { toast } from './ui/sonner';
import { useOnlineStatus } from '../hooks/use-online-status';

export function OfflineToast() {
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error('You are offline. Cached data will be shown.');
    } else {
      toast.success('You are back online.');
    }
  }, [isOnline]);

  return null;
}
