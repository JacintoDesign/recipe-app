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

  return (
    <section className="flex flex-col gap-6 py-8" aria-labelledby="favorites-heading">
      <div>
        <h1 id="favorites-heading" className="text-3xl font-semibold">
          Saved recipes
        </h1>
        <p className="text-muted-foreground">Favorites stay available even when offline.</p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <MealCardSkeleton key={index} />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Save recipes to access them offline."
        />
      )}
    </section>
  );
}
