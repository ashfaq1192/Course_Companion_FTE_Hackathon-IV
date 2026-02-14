interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private cache: Map<string, CacheEntry>;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.cache = new Map();
    this.startCleanupTimer();
  }

  /**
   * Get data from cache
   */
  public get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set data in cache
   */
  public set(key: string, data: any, ttl?: number): void {
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL
    };

    this.cache.set(key, cacheEntry);
  }

  /**
   * Delete data from cache
   */
  public delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  public clear(): void {
    this.cache.clear();
  }

  /**
   * Check if a key exists in cache
   */
  public has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache size
   */
  public size(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   */
  public keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 60 * 1000); // Clean up every minute
  }

  /**
   * Remove expired entries from cache
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * Generate cache key from endpoint and parameters
   */
  public generateCacheKey(endpoint: string, params?: { [key: string]: any }): string {
    if (!params) {
      return endpoint;
    }

    // Sort parameters to ensure consistent key generation
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as { [key: string]: any });

    const paramString = new URLSearchParams(sortedParams).toString();
    return `${endpoint}?${paramString}`;
  }

  /**
   * Cache API response with default TTL
   */
  public cacheApiResponse(endpoint: string, data: any, params?: { [key: string]: any }, customTTL?: number): void {
    const key = this.generateCacheKey(endpoint, params);
    this.set(key, data, customTTL);
  }

  /**
   * Get cached API response
   */
  public getCachedApiResponse(endpoint: string, params?: { [key: string]: any }): any | null {
    const key = this.generateCacheKey(endpoint, params);
    return this.get(key);
  }

  /**
   * Invalidate cache for specific endpoint
   */
  public invalidateEndpoint(endpoint: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.startsWith(endpoint)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * Invalidate cache for specific endpoint with parameters
   */
  public invalidateEndpointWithParams(endpoint: string, params?: { [key: string]: any }): void {
    const key = this.generateCacheKey(endpoint, params);
    this.delete(key);
  }

  /**
   * Get cache statistics
   */
  public getStats(): { size: number; keys: string[] } {
    return {
      size: this.size(),
      keys: this.keys()
    };
  }
}

export default new CacheService();