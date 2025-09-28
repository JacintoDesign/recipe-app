import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFavorites } from '../features/favorites/favorites-context';
import { MealCard, MealCardSkeleton } from '../components/meal-card';
import { EmptyState } from '../components/empty-state';
import { useEffect, useState } from 'react';
export function FavoritesPage() {
    const { favorites, refreshFavorites } = useFavorites();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadFavorites = async () => {
            await refreshFavorites();
            setLoading(false);
        };
        loadFavorites();
    }, [refreshFavorites]);
    return (_jsxs("section", { className: "flex flex-col gap-6 py-8", "aria-labelledby": "favorites-heading", children: [_jsxs("div", { children: [_jsx("h1", { id: "favorites-heading", className: "text-3xl font-semibold", children: "Saved recipes" }), _jsx("p", { className: "text-muted-foreground", children: "Favorites stay available even when offline." })] }), loading ? (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: Array.from({ length: 4 }).map((_, index) => (_jsx(MealCardSkeleton, {}, index))) })) : favorites.length > 0 ? (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: favorites.map((meal) => (_jsx(MealCard, { meal: meal }, meal.idMeal))) })) : (_jsx(EmptyState, { title: "No favorites yet", description: "Save recipes to access them offline." }))] }));
}
