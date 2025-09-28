import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { MealCard, MealCardSkeleton } from './meal-card';
export function MealList({ meals, isLoading = false, emptyState }) {
    if (isLoading) {
        return (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: Array.from({ length: 8 }).map((_, index) => (_jsx(MealCardSkeleton, {}, index))) }));
    }
    if (!meals || meals.length === 0) {
        return emptyState ? _jsx(_Fragment, { children: emptyState }) : null;
    }
    return (_jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: meals.map((meal) => (_jsx(MealCard, { meal: meal }, meal.idMeal))) }));
}
