import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { useFavorites } from '../features/favorites/favorites-context';
import { Star } from 'lucide-react';
import { cacheAssets } from '../lib/cache';
import { api } from '../lib/api';
export function MealCard({ meal }) {
    const { isFavorite, toggleFavoriteById } = useFavorites();
    const favorite = isFavorite(meal.idMeal);
    useEffect(() => {
        cacheAssets([meal.strMealThumb]);
        api
            .getMeal(meal.idMeal)
            .then(() => cacheAssets([`/api/meal/${meal.idMeal}`]))
            .catch(() => {
            /* ignore */
        });
    }, [meal.idMeal, meal.strMealThumb]);
    return (_jsxs(Card, { className: "flex flex-col overflow-hidden", children: [_jsx(CardHeader, { className: "p-0", children: _jsx(Link, { to: `/meal/${meal.idMeal}`, className: "block", children: meal.strMealThumb ? (_jsx("img", { src: meal.strMealThumb, alt: meal.strMeal, className: "h-48 w-full object-cover", loading: "lazy" })) : (_jsx("div", { className: "flex h-48 items-center justify-center bg-muted text-muted-foreground", children: "No image available" })) }) }), _jsxs(CardContent, { className: "flex flex-1 flex-col gap-2 p-4", children: [_jsx(CardTitle, { className: "line-clamp-2 text-lg", children: meal.strMeal }), _jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-muted-foreground", children: [meal.strCategory ? _jsx(Badge, { variant: "outline", children: meal.strCategory }) : null, meal.strArea ? _jsx(Badge, { variant: "outline", children: meal.strArea }) : null] })] }), _jsxs(CardFooter, { className: "flex items-center justify-between p-4 pt-0", children: [_jsx(Button, { asChild: true, variant: "outline", children: _jsx(Link, { to: `/meal/${meal.idMeal}`, children: "View" }) }), _jsx("button", { type: "button", onClick: () => toggleFavoriteById(meal.idMeal), "aria-pressed": favorite, title: favorite ? 'Remove from Favorites' : 'Add to Favorites', className: "rounded-full border border-border p-2 transition-colors hover:bg-accent hover:text-accent-foreground", children: _jsx(Star, { className: favorite ? 'h-5 w-5 fill-current text-brand' : 'h-5 w-5 text-muted-foreground' }) })] })] }));
}
export function MealCardSkeleton() {
    return (_jsxs(Card, { className: "overflow-hidden", children: [_jsx(Skeleton, { className: "h-48 w-full" }), _jsxs(CardContent, { className: "space-y-3 p-4", children: [_jsx(Skeleton, { className: "h-6 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }), _jsxs(CardFooter, { className: "flex items-center justify-between p-4 pt-0", children: [_jsx(Skeleton, { className: "h-10 w-20" }), _jsx(Skeleton, { className: "h-10 w-24" })] })] }));
}
