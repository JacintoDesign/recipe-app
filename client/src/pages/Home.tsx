import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Category, FilterResponse, MealSummary, SearchResponse } from '../types/meal';
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
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY);
  const isSearching = Boolean(queryParam);

  const categoriesQuery = useQuery<{ categories: Category[] }>({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await api.getCategories();
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(
            CATEGORY_CACHE_KEY,
            JSON.stringify({ data, timestamp: Date.now() }),
          );
        } catch (error) {
          console.warn('Unable to cache categories', error);
        }
      }
      return data;
    },
    initialData: () => {
      if (typeof window === 'undefined') return undefined;
      try {
        const cached = window.localStorage.getItem(CATEGORY_CACHE_KEY);
        if (!cached) return undefined;
        const parsed = JSON.parse(cached) as { data: { categories: Category[] }; timestamp: number };
        if (Date.now() - parsed.timestamp > CATEGORY_CACHE_TTL) {
          return undefined;
        }
        return parsed.data;
      } catch (error) {
        console.warn('Unable to read cached categories', error);
        return undefined;
      }
    },
    staleTime: CATEGORY_CACHE_TTL,
    gcTime: CATEGORY_CACHE_TTL * 2,
  });

  const searchMealsQuery = useQuery<SearchResponse>({
    queryKey: ['search', queryParam],
    queryFn: () => api.searchMeals(queryParam),
    enabled: Boolean(queryParam),
    refetchOnWindowFocus: false,
  });

  const filterQuery = useQuery<FilterResponse>({
    queryKey: ['filter', selectedCategory],
    queryFn: () => api.filterByCategory(selectedCategory),
    enabled: !queryParam && Boolean(selectedCategory),
  });

  useEffect(() => {
    if (queryParam) {
      setSelectedCategory(DEFAULT_CATEGORY);
    }
  }, [queryParam]);

  const meals: MealSummary[] = useMemo(() => {
    if (queryParam) {
      return (searchMealsQuery.data?.meals ?? []) as MealSummary[];
    }
    return (filterQuery.data?.meals ?? []) as MealSummary[];
  }, [queryParam, searchMealsQuery.data, filterQuery.data]);

  return (
    <section className="flex flex-col gap-8 py-8" aria-labelledby="home-heading">
      <div className="flex flex-col gap-4">
        <div>
          <h1 id="home-heading" className="text-3xl font-semibold">
            Discover recipes
          </h1>
          <p className="text-muted-foreground">Browse categories or search for your next meal.</p>
        </div>
        {categoriesQuery.data?.categories?.length ? (
          <CategoryChips
            categories={categoriesQuery.data.categories.map((category) => category.strCategory)}
            activeCategory={selectedCategory}
            onSelect={setSelectedCategory}
            onCategoriesLoaded={(cats) => {
              const thumbMap = new Map(
                categoriesQuery.data?.categories.map((category) => [category.strCategory, category.strCategoryThumb]) ?? [],
              );
              cacheAssets(cats.map((cat) => thumbMap.get(cat)));
            }}
          />
        ) : null}
      </div>

      <MealList
        meals={meals}
        isLoading={isSearching ? searchMealsQuery.isLoading : filterQuery.isLoading}
        emptyState={
          <EmptyState
            title={isSearching ? 'No recipes found' : 'No meals found'}
            description={
              isSearching
                ? 'Try a different search term.'
                : 'No meals found in this category.'
            }
          />
        }
      />
    </section>
  );
}
