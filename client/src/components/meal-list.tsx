import type { MealSummary } from '../types/meal';
import { MealCard, MealCardSkeleton } from './meal-card';

interface MealListProps {
  meals: MealSummary[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function MealList({ meals, isLoading = false, emptyState }: MealListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <MealCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {meals.map((meal) => (
        <MealCard key={meal.idMeal} meal={meal} />
      ))}
    </div>
  );
}
