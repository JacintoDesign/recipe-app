import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { MealList } from '../components/meal-list';
import { CategoryChips } from '../components/category-chips';
import { EmptyState } from '../components/empty-state';
import { cacheAssets } from '../lib/cache';
export function HomePage() {
    const CATEGORY_CACHE_KEY = 'recipes-categories-cache-v1';
    const CATEGORY_CACHE_TTL = 1000 * 60 * 60 * 12;
    const DEFAULT_CATEGORY = 'Beef';
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('q') ?? '';
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const isSearching = Boolean(queryParam);
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const data = await api.getCategories();
            if (typeof window !== 'undefined') {
                try {
                    window.localStorage.setItem(CATEGORY_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
                }
                catch (error) {
                    console.warn('Unable to cache categories', error);
                }
            }
            return data;
        },
        initialData: () => {
            if (typeof window === 'undefined')
                return undefined;
            try {
                const cached = window.localStorage.getItem(CATEGORY_CACHE_KEY);
                if (!cached)
                    return undefined;
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp > CATEGORY_CACHE_TTL) {
                    return undefined;
                }
                return parsed.data;
            }
            catch (error) {
                console.warn('Unable to read cached categories', error);
                return undefined;
            }
        },
        staleTime: CATEGORY_CACHE_TTL,
        gcTime: CATEGORY_CACHE_TTL * 2,
    });
    const searchMealsQuery = useQuery({
        queryKey: ['search', queryParam],
        queryFn: () => api.searchMeals(queryParam),
        enabled: Boolean(queryParam),
        refetchOnWindowFocus: false,
    });
    const filterQuery = useQuery({
        queryKey: ['filter', selectedCategory],
        queryFn: () => api.filterByCategory(selectedCategory),
        enabled: !queryParam && Boolean(selectedCategory),
    });
    useEffect(() => {
        if (queryParam) {
            setSelectedCategory(DEFAULT_CATEGORY);
        }
    }, [queryParam]);
    const meals = useMemo(() => {
        if (queryParam) {
            return (searchMealsQuery.data?.meals ?? []);
        }
        return (filterQuery.data?.meals ?? []);
    }, [queryParam, searchMealsQuery.data, filterQuery.data]);
    return (_jsxs("section", { className: "flex flex-col gap-8 py-8", "aria-labelledby": "home-heading", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { children: [_jsx("h1", { id: "home-heading", className: "text-3xl font-semibold", children: "Discover recipes" }), _jsx("p", { className: "text-muted-foreground", children: "Browse categories or search for your next meal." })] }), categoriesQuery.data?.categories?.length ? (_jsx(CategoryChips, { categories: categoriesQuery.data.categories.map((category) => category.strCategory), activeCategory: selectedCategory, onSelect: setSelectedCategory, onCategoriesLoaded: (cats) => {
                            const thumbMap = new Map(categoriesQuery.data?.categories.map((category) => [category.strCategory, category.strCategoryThumb]) ?? []);
                            cacheAssets(cats.map((cat) => thumbMap.get(cat)));
                        } })) : null] }), _jsx(MealList, { meals: meals, isLoading: isSearching ? searchMealsQuery.isLoading : filterQuery.isLoading, emptyState: _jsx(EmptyState, { title: isSearching ? 'No recipes found' : 'No meals found', description: isSearching
                        ? 'Try a different search term.'
                        : 'No meals found in this category.' }) })] }));
}
