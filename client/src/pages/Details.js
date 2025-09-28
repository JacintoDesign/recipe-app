import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatIngredient } from '../lib/utils';
import { useFavorites } from '../features/favorites/favorites-context';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { getFavorite, getMealDetail, saveMealDetail } from '../features/favorites/db';
export function DetailsPage() {
    const { id } = useParams();
    const { toggleFavoriteById, isFavorite } = useFavorites();
    const [cachedMeal, setCachedMeal] = useState(null);
    useEffect(() => {
        if (!id)
            return;
        let active = true;
        (async () => {
            const cached = (await getMealDetail(id)) ?? (await getFavorite(id));
            if (cached && active) {
                setCachedMeal(cached);
            }
        })();
        return () => {
            active = false;
        };
    }, [id]);
    const mealQuery = useQuery({
        queryKey: ['meal', id],
        queryFn: async () => {
            if (!id) {
                return { meals: null };
            }
            const cached = (await getMealDetail(id)) ?? (await getFavorite(id));
            if (cached) {
                return { meals: [cached] };
            }
            try {
                const response = await api.getMeal(id);
                const meal = response.meals?.[0];
                if (meal) {
                    await saveMealDetail(meal);
                }
                return response;
            }
            catch (error) {
                if (cached) {
                    return { meals: [cached] };
                }
                throw error;
            }
        },
        enabled: Boolean(id),
        retry: cachedMeal ? 0 : 1,
    });
    if (mealQuery.isLoading && !cachedMeal) {
        return (_jsxs("section", { className: "grid gap-6 py-8 md:grid-cols-[2fr_1fr]", children: [_jsx(Skeleton, { className: "aspect-video w-full" }), _jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-10 w-3/4" }), _jsx(Skeleton, { className: "h-4 w-1/2" }), _jsx(Skeleton, { className: "h-20" })] })] }));
    }
    const meal = mealQuery.data?.meals?.[0] ?? cachedMeal;
    if (!meal) {
        return (_jsxs("section", { className: "py-8", children: [_jsx("h2", { className: "text-2xl font-semibold", children: "Recipe not found" }), _jsx("p", { className: "text-muted-foreground", children: "Try another meal." })] }));
    }
    const favorite = isFavorite(meal.idMeal);
    const ingredients = Array.from({ length: 20 })
        .map((_, index) => formatIngredient(meal[`strIngredient${index + 1}`], meal[`strMeasure${index + 1}`]))
        .filter(Boolean);
    return (_jsxs("article", { className: "grid gap-8 py-8 md:grid-cols-[2fr_1fr]", "aria-labelledby": "meal-title", children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h1", { id: "meal-title", className: "text-3xl font-bold", children: meal.strMeal }), _jsxs("div", { className: "flex flex-wrap gap-2 text-sm text-muted-foreground", children: [meal.strCategory && _jsx(Badge, { variant: "outline", children: meal.strCategory }), meal.strArea && _jsx(Badge, { variant: "outline", children: meal.strArea }), meal.strTags
                                        ?.split(',')
                                        .map((rawTag) => rawTag.trim())
                                        .filter(Boolean)
                                        .map((tag) => (_jsxs(Badge, { variant: "secondary", children: ["#", tag] }, tag)))] })] }), meal.strMealThumb ? (_jsx("img", { src: meal.strMealThumb, alt: meal.strMeal, className: "aspect-video w-full rounded-lg object-cover" })) : null, _jsxs("section", { "aria-labelledby": "instructions-heading", className: "space-y-4", children: [_jsx("h2", { id: "instructions-heading", className: "text-2xl font-semibold", children: "Instructions" }), _jsx("div", { className: "space-y-3 whitespace-pre-line text-lg leading-relaxed", children: meal.strInstructions })] }), meal.strYoutube ? (_jsx("a", { href: meal.strYoutube, className: "inline-flex items-center gap-2 text-brand hover:underline", target: "_blank", rel: "noreferrer", children: "Watch on YouTube" })) : null] }), _jsxs("aside", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-lg border p-6", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Ingredients" }), _jsx("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: ingredients.map((ingredient, index) => (_jsx("li", { children: ingredient }, index))) })] }), _jsx("div", { className: "flex flex-col gap-3", children: _jsx(Button, { onClick: () => toggleFavoriteById(meal.idMeal), "aria-pressed": favorite, children: favorite ? 'Remove from Favorites' : 'Save to Favorites' }) })] })] }));
}
