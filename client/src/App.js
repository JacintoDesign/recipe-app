import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { AppHeader } from './components/app-header';
import { OfflineBanner } from './components/offline-banner';
import { OfflineToast } from './components/offline-toast';
import { ErrorBoundary } from './components/error-boundary';
export function App() {
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [_jsx("a", { href: "#main", className: "sr-only focus:not-sr-only", children: "Skip to content" }), _jsx(OfflineBanner, {}), _jsx(OfflineToast, {}), _jsx(AppHeader, {}), _jsx("main", { id: "main", className: "mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16", children: _jsx(ErrorBoundary, { children: _jsx(Outlet, {}) }) })] }));
}
