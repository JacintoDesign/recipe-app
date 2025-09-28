const headers = {
    'Content-Type': 'application/json',
};
async function request(url, init) {
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
    return response.json();
}
export const api = {
    searchMeals: (query) => request(`/api/search?q=${encodeURIComponent(query)}`),
    getMeal: (id) => request(`/api/meal/${id}`),
    getCategories: () => request('/api/categories'),
    filterByCategory: (category) => request(`/api/filter?c=${encodeURIComponent(category)}`),
    getRandomMeal: () => request('/api/random'),
};
