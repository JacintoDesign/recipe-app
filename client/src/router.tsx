import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/Home';
import { DetailsPage } from './pages/Details';
import { FavoritesPage } from './pages/Favorites';
import { ErrorBoundary } from './components/error-boundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <ErrorBoundary>
        <HomePage />
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'meal/:id', element: <DetailsPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
    ],
  },
]);
