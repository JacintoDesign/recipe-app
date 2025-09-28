import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';
import { HomePage } from './pages/Home';
import { DetailsPage } from './pages/Details';
import { FavoritesPage } from './pages/Favorites';
import { ErrorBoundary } from './components/error-boundary';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(App, {}),
        errorElement: (_jsx(ErrorBoundary, { children: _jsx(HomePage, {}) })),
        children: [
            { index: true, element: _jsx(HomePage, {}) },
            { path: 'meal/:id', element: _jsx(DetailsPage, {}) },
            { path: 'favorites', element: _jsx(FavoritesPage, {}) },
        ],
    },
]);
