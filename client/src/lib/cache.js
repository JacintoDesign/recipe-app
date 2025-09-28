export function cacheAssets(urls) {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
        return;
    }
    const assets = urls.filter((url) => Boolean(url));
    if (assets.length === 0) {
        return;
    }
    const message = { type: 'CACHE_ASSETS', payload: { urls: assets } };
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
        return;
    }
    navigator.serviceWorker.ready
        .then((registration) => {
        registration.active?.postMessage(message);
    })
        .catch((error) => {
        console.warn('Unable to cache assets', error);
    });
}
