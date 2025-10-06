import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatIngredient } from '../lib/utils';
import { useFavorites } from '../features/favorites/favorites-context';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import type { LookupResponse, Meal } from '../types/meal';
import { getFavorite, getMealDetail, saveMealDetail } from '../features/favorites/db';

export function DetailsPage() {
  const { id } = useParams();
  const { toggleFavoriteById, isFavorite } = useFavorites();
  const [cachedMeal, setCachedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    if (!id) return;
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

  const mealQuery = useQuery<LookupResponse>({
    queryKey: ['meal', id],
    queryFn: async () => {
      if (!id) {
        return { meals: null } as LookupResponse;
      }

      const cached = (await getMealDetail(id)) ?? (await getFavorite(id));
      if (cached) {
        return { meals: [cached] } as LookupResponse;
      }

      try {
        const response = await api.getMeal(id);
        const meal = response.meals?.[0];
        if (meal) {
          await saveMealDetail(meal);
        }
        return response;
      } catch (error) {
        if (cached) {
          return { meals: [cached] } as LookupResponse;
        }
        throw error;
      }
    },
    enabled: Boolean(id),
    retry: cachedMeal ? 0 : 1,
  });

  if (mealQuery.isLoading && !cachedMeal) {
    return (
      <section className="grid gap-6 py-8 md:grid-cols-[2fr_1fr]">
        <Skeleton className="aspect-video w-full" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20" />
        </div>
      </section>
    );
  }

  const meal = mealQuery.data?.meals?.[0] ?? cachedMeal;

  if (!meal) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-semibold">Recipe not found</h2>
        <p className="text-muted-foreground">Try another meal.</p>
      </section>
    );
  }

  const favorite = isFavorite(meal.idMeal);

  const ingredients = Array.from({ length: 20 })
    .map((_, index) => formatIngredient(meal[`strIngredient${index + 1}`], meal[`strMeasure${index + 1}`]))
    .filter(Boolean) as string[];

  return (
    <article className="grid gap-8 py-8 md:grid-cols-[2fr_1fr]" aria-labelledby="meal-title">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 id="meal-title" className="text-3xl font-bold">
            {meal.strMeal}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {meal.strCategory && <Badge variant="outline">{meal.strCategory}</Badge>}
            {meal.strArea && <Badge variant="outline">{meal.strArea}</Badge>}
            {meal.strTags
              ?.split(',')
              .map((rawTag) => rawTag.trim())
              .filter(Boolean)
              .map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
          </div>
        </div>
        {meal.strMealThumb ? (
          <img src={meal.strMealThumb} alt={meal.strMeal} className="aspect-video w-full rounded-lg object-cover" />
        ) : null}
        {/* Mobile-only Ingredients before Instructions */}
        <div className="rounded-lg border p-6 md:hidden">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        {/* Mobile-only Favorite button */}
        <div className="md:hidden">
          <div className="flex flex-col gap-3">
            <Button onClick={() => toggleFavoriteById(meal.idMeal)} aria-pressed={favorite}>
              {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
            </Button>
          </div>
        </div>
        <section aria-labelledby="instructions-heading" className="space-y-4">
          <h2 id="instructions-heading" className="text-2xl font-semibold">
            Instructions
          </h2>
          <div className="space-y-3 whitespace-pre-line text-lg leading-relaxed">{meal.strInstructions}</div>
        </section>
        {meal.strYoutube ? (
          <a
            href={meal.strYoutube}
            className="inline-flex items-center gap-2 text-brand hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Watch on YouTube
          </a>
        ) : null}
      </div>
      <aside className="hidden space-y-6 md:block">
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => toggleFavoriteById(meal.idMeal)} aria-pressed={favorite}>
            {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
          </Button>
        </div>
      </aside>
    </article>
  );
}
