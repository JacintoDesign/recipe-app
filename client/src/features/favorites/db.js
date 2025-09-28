import { openDB } from 'idb';
const DB_NAME = 'recipes-favorites';
const STORE_NAME = 'favorites';
const DETAILS_STORE_NAME = 'meal-details';
const DB_VERSION = 2;
async function getDb() {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'idMeal' });
            }
            if (oldVersion < 2 && !db.objectStoreNames.contains(DETAILS_STORE_NAME)) {
                db.createObjectStore(DETAILS_STORE_NAME, { keyPath: 'idMeal' });
            }
        },
    });
}
export async function saveFavorite(meal) {
    const db = await getDb();
    await db.put(STORE_NAME, meal);
}
export async function removeFavorite(id) {
    const db = await getDb();
    await db.delete(STORE_NAME, id);
}
export async function getFavorite(id) {
    const db = await getDb();
    return db.get(STORE_NAME, id);
}
export async function getAllFavorites() {
    const db = await getDb();
    return db.getAll(STORE_NAME);
}
export async function isFavorite(id) {
    const favorite = await getFavorite(id);
    return Boolean(favorite);
}
export async function saveMealDetail(meal) {
    const db = await getDb();
    await db.put(DETAILS_STORE_NAME, meal);
}
export async function getMealDetail(id) {
    const db = await getDb();
    return db.get(DETAILS_STORE_NAME, id);
}
