import type { PoolSpec } from "config";

import { usePoolStateQueries } from "./usePoolStateQueries";

export const useIsRequiredPoolsPaused = (
  poolSpecs: readonly PoolSpec[],
): boolean => {
  const poolStateQueries = usePoolStateQueries(poolSpecs);
  return poolStateQueries
    .map((query) => query.data ?? null)
    .some((poolState) => poolState && poolState.isPaused);
};
