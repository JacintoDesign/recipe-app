import type { CategoriesResponse, FilterResponse, LookupResponse, SearchResponse } from '../types/meal';

const headers = {
  'Content-Type': 'application/json',
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  searchMeals: (query: string) => request<SearchResponse>(`/api/search?q=${encodeURIComponent(query)}`),
  getMeal: (id: string) => request<LookupResponse>(`/api/meal/${id}`),
  getCategories: () => request<CategoriesResponse>('/api/categories'),
  filterByCategory: (category: string) => request<FilterResponse>(`/api/filter?c=${encodeURIComponent(category)}`),
  getRandomMeal: () => request<LookupResponse>('/api/random'),
};
