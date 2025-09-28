import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Meal } from '../../types/meal';
import { getAllFavorites, getFavorite, getMealDetail, removeFavorite, saveFavorite, saveMealDetail } from './db';
import { api } from '../../lib/api';
import { toast } from '../../components/ui/sonner';
import { cacheAssets } from '../../lib/cache';

type FavoritesContextValue = {
  favorites: Meal[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (meal: Meal) => Promise<void>;
  toggleFavoriteById: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Meal[]>([]);

  const refreshFavorites = useCallback(async () => {
    const all = await getAllFavorites();
    setFavorites(all);
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  useEffect(() => {
    cacheAssets([
      ...favorites.map((meal) => meal.strMealThumb),
      ...favorites.map((meal) => `/api/meal/${meal.idMeal}`),
    ]);
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.some((favorite) => favorite.idMeal === id), [favorites]);

  const toggleFavorite = useCallback(
    async (meal: Meal) => {
      const exists = await getFavorite(meal.idMeal);
      if (exists) {
        await removeFavorite(meal.idMeal);
        toast.info(`${meal.strMeal} removed from favorites`);
      } else {
        let detail = meal;
        try {
          const response = await api.getMeal(meal.idMeal);
          detail = response.meals?.[0] ?? meal;
        } catch (error) {
          console.warn('Unable to fetch meal detail for caching', error);
        }
        await Promise.all([saveFavorite(detail), saveMealDetail(detail)]);
        toast.success(`${detail.strMeal} added to favorites`);
        cacheAssets([detail.strMealThumb, `/api/meal/${detail.idMeal}`]);
      }
      await refreshFavorites();
    },
    [refreshFavorites],
  );

  const toggleFavoriteById = useCallback(
    async (id: string) => {
      const exists = await getFavorite(id);
      if (exists) {
        await removeFavorite(id);
        toast.info(`${exists.strMeal} removed from favorites`);
        await refreshFavorites();
        return;
      }

      try {
        const cachedDetail = await getMealDetail(id);
        const mealResponse = cachedDetail ? { meals: [cachedDetail] } : await api.getMeal(id);
        const meal = mealResponse.meals?.[0];
        if (meal) {
          await Promise.all([saveFavorite(meal as Meal), saveMealDetail(meal as Meal)]);
          toast.success(`${meal.strMeal} added to favorites`);
          cacheAssets([meal.strMealThumb, `/api/meal/${meal.idMeal}`]);
          await refreshFavorites();
        } else {
          toast.error('Unable to load recipe details to favorite.');
        }
      } catch (error) {
        console.error(error);
        toast.error('Unable to favorite while offline. Try again when online.');
      }
    },
    [refreshFavorites],
  );

  const removeFavoriteById = useCallback(
    async (id: string) => {
    await removeFavorite(id);
    await refreshFavorites();
    toast.info('Favorite removed');
    },
    [refreshFavorites],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, toggleFavoriteById, removeFavorite: removeFavoriteById, refreshFavorites }),
    [favorites, isFavorite, toggleFavorite, toggleFavoriteById, removeFavoriteById, refreshFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
