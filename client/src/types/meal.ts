export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  strImageSource: string | null;
  strCreativeCommonsConfirmed: string | null;
  dateModified: string | null;
  [key: string]: string | null;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string | null;
  strCategory?: string | null;
  strArea?: string | null;
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryDescription: string;
  strCategoryThumb: string;
}

export interface SearchResponse {
  meals: Meal[] | null;
}

export interface LookupResponse {
  meals: Meal[] | null;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface FilterResponse {
  meals: MealSummary[] | null;
}
