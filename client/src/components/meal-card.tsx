import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import type { MealSummary } from '../types/meal';
import { useFavorites } from '../features/favorites/favorites-context';
import { Star } from 'lucide-react';
import { cacheAssets } from '../lib/cache';
import { api } from '../lib/api';

interface MealCardProps {
  meal: MealSummary;
}

export function MealCard({ meal }: MealCardProps) {
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

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Link to={`/meal/${meal.idMeal}`} className="block">
          {meal.strMealThumb ? (
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
              No image available
            </div>
          )}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <CardTitle className="line-clamp-2 text-lg">{meal.strMeal}</CardTitle>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {meal.strCategory ? <Badge variant="outline">{meal.strCategory}</Badge> : null}
          {meal.strArea ? <Badge variant="outline">{meal.strArea}</Badge> : null}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Button asChild variant="outline">
          <Link to={`/meal/${meal.idMeal}`}>View</Link>
        </Button>
        <button
          type="button"
          onClick={() => toggleFavoriteById(meal.idMeal)}
          aria-pressed={favorite}
          title={favorite ? 'Remove from Favorites' : 'Add to Favorites'}
          className="rounded-full border border-border p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Star className={favorite ? 'h-5 w-5 fill-current text-brand' : 'h-5 w-5 text-muted-foreground'} />
        </button>
      </CardFooter>
    </Card>
  );
}

export function MealCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}
