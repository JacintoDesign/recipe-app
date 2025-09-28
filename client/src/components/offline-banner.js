import { jsx as _jsx } from "react/jsx-runtime";
import { useOnlineStatus } from '../hooks/use-online-status';
export function OfflineBanner() {
    const isOnline = useOnlineStatus();
    if (isOnline)
        return null;
    return (_jsx("div", { className: "flex items-center justify-center bg-yellow-500/90 px-4 py-2 text-sm font-medium text-foreground", children: "Offline mode: some features may be limited." }));
}
