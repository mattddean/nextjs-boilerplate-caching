import { unstable_cache } from "next/cache";
import { cache } from "react";

type Primitive = string | number | boolean;
type PrimitiveObj = Record<string, Primitive>;
type Args = (Primitive | string[] | number[] | boolean[] | PrimitiveObj)[];

type NextCache2Options<T> = {
  fn: T;
  uniqueFnId: string;
  revalidate: number;
  tags?: string[];
};

type Callback<T extends Args, U> = (...args: T) => U;
type UnstableCacheCallback = Parameters<typeof unstable_cache>[0];

type NextCacheOptions<T extends string> = {
  /** A unique identifier for this function */
  uniqueFnId: T;
  /** `revalidate` option for unstable_cache (seconds). To pass `false`, call `nextCacheNoRevalidate` instead. */
  revalidate: number;
  tags?: string[];
};

export function nextCache2<
  T extends (...args: any[]) => any,
  A extends Parameters<T> & Args
>(options: NextCache2Options<T>, ...args: A) {
  // cache duplicate fetches within the same request
  const reactCachedFn = cache((_uniqId: string, ...cbArgs: A) => {
    // in development, skip global caching; do only request-level caching
    if (process.env.NODE_ENV === "development")
      return (options.fn as UnstableCacheCallback)(...cbArgs);

    // cache globally (stale-while-revalidate behavior)
    // TODO: avoid type assertion
    const cached = unstable_cache(
      options.fn as UnstableCacheCallback,
      [options.uniqueFnId],
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    );
    return cached(...cbArgs);
  });

  return reactCachedFn(options.uniqueFnId, ...args) as Promise<
    ReturnType<typeof options.fn>
  >; // TODO: avoid type assertion
}

const uniqueFnKeys = {
  testCache1: async () => {
    console.time("revalidate testCache1 test");
    await new Promise((r) => setTimeout(r, 5000));
    console.timeEnd("revalidate testCache1 test");
    return "testCache1 test";
  },
};

/**
 * Cache an arbitrary function's results locally (per-request) and globally (in Vercel's Data Cache).
 */
export function nextCache<
  T extends keyof typeof uniqueFnKeys,
  A extends Parameters<(typeof uniqueFnKeys)[T]> & Args
>(options: NextCacheOptions<T>, ...args: A) {
  const cb = uniqueFnKeys[options.uniqueFnId];

  // cache duplicate fetches within the same request
  const fn = cache((_uniqId: string, ...cbArgs: A) => {
    // in development, skip global caching; do only request-level caching
    if (process.env.NODE_ENV === "development")
      return (cb as UnstableCacheCallback)(...cbArgs);

    // cache globally (stale-while-revalidate behavior)
    // TODO: avoid type assertion
    const cached = unstable_cache(
      cb as UnstableCacheCallback,
      [options.uniqueFnId],
      {
        revalidate: options.revalidate,
        tags: options.tags,
      }
    );
    return cached(...cbArgs);
  });

  return fn(options.uniqueFnId, ...args) as Promise<ReturnType<typeof cb>>; // TODO: avoid type assertion
}
