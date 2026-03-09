/**
 * Simple sessionStorage cache for Super Admin Dashboard data.
 * Data is cached per browser session with a configurable TTL.
 */

const CACHE_PREFIX = "sa_dash_";
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedItem<T> {
  data: T;
  timestamp: number;
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const parsed: CachedItem<T> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > DEFAULT_TTL_MS) {
      sessionStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T): void {
  try {
    const item: CachedItem<T> = { data, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

/**
 * Invalidate all dashboard cache entries.
 * Call this after any create / update / delete operation.
 */
export function invalidateDashboardCache(): void {
  try {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k?.startsWith(CACHE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => sessionStorage.removeItem(k));
  } catch {
    // ignore
  }
}
