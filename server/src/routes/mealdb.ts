import express from 'express';
import fetch from 'node-fetch';
import type { Request, Response, NextFunction } from 'express';
import NodeCache from 'node-cache';

const router = express.Router();

const mealCache = new NodeCache({ stdTTL: Number(process.env.CACHE_TTL_MS ?? 600000) / 1000 });

const getApiUrl = (path: string, query: URLSearchParams = new URLSearchParams()) => {
  const apiBase = process.env.MEALDB_API_BASE ?? 'https://www.themealdb.com/api/json/v1';
  const apiKey = process.env.MEALDB_API_KEY ?? '1';
  const url = new URL(`${apiBase}/${apiKey}/${path}`);
  query.forEach((value, key) => url.searchParams.append(key, value));
  return url.toString();
};

type ProxyOptions = {
  path: string;
  cacheKey?: string;
  query?: Record<string, string | undefined>;
  stripKeys?: string[];
};

const handleProxy = async (req: Request, res: Response, next: NextFunction, options: ProxyOptions) => {
  try {
    const { path, cacheKey, query: overrideQuery } = options;
    if (cacheKey) {
      const cached = mealCache.get(cacheKey);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached);
      }
    }

    const params = new URLSearchParams();
    const stripKeys = options.stripKeys ?? [];
    Object.entries(req.query as Record<string, string | string[] | undefined>).forEach(([key, value]) => {
      if (stripKeys.includes(key)) {
        return;
      }
      if (typeof value === 'string') {
        params.append(key, value);
      }
    });
    if (overrideQuery) {
      Object.entries(overrideQuery).forEach(([key, value]) => {
        if (typeof value === 'string') {
          params.set(key, value);
        }
      });
    }

    const targetUrl = getApiUrl(path, params);
    const response = await fetch(targetUrl);

    if (!response.ok) {
      throw new Error(`Upstream response not OK: ${response.status}`);
    }

    const data = await response.json();

    res.setHeader('Cache-Control', cacheKey ? 'public, max-age=600' : 'no-store');

    if (cacheKey) {
      mealCache.set(cacheKey, data);
    }

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};
router.get('/search', (req, res, next) => {
  const rawQuery = (req.query.q as string | undefined)?.trim() ?? '';
  const isSingleLetter = rawQuery.length === 1 && /^[a-z]$/i.test(rawQuery);

  if (!rawQuery) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }

  const proxyQuery = isSingleLetter ? { f: rawQuery } : { s: rawQuery };

  return handleProxy(req, res, next, {
    path: 'search.php',
    cacheKey: `search:${isSingleLetter ? 'letter' : 'name'}:${rawQuery.toLowerCase()}`,
    query: proxyQuery,
    stripKeys: ['q'],
  });
});

router.get('/meal/:id', (req, res, next) =>
  handleProxy(req, res, next, {
    path: 'lookup.php',
    cacheKey: `meal:${req.params.id}`,
    query: { i: req.params.id },
  }),
);

router.get('/categories', (req, res, next) =>
  handleProxy(req, res, next, {
    path: 'categories.php',
    cacheKey: 'categories',
  }),
);

router.get('/filter', (req, res, next) =>
  handleProxy(req, res, next, {
    path: 'filter.php',
    cacheKey: `filter:${req.query.c ?? 'all'}`,
    query: { c: (req.query.c as string) ?? undefined },
  }),
);

router.get('/random', (req, res, next) =>
  handleProxy(req, res, next, {
    path: 'random.php',
  }),
);

export default router;
