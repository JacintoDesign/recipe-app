import { Outlet } from 'react-router-dom';
import { AppHeader } from './components/app-header';
import { OfflineBanner } from './components/offline-banner';
import { OfflineToast } from './components/offline-toast';
import { ErrorBoundary } from './components/error-boundary';

export function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <OfflineBanner />
      <OfflineToast />
      <AppHeader />
      <main id="main" className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
