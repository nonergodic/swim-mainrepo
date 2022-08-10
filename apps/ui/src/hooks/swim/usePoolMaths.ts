import PoolMath from "@swim-io/pool-math";
import { isEachNotNull } from "@swim-io/utils";
import Decimal from "decimal.js";

import { atomicToHuman, bnOrBigNumberToDecimal } from "../../amounts";
import { EcosystemId, getSolanaTokenDetails } from "../../config";
import { selectConfig } from "../../core/selectors";
import { useEnvironment } from "../../core/store";
import { Amount, isEvmPoolState } from "../../models";

import type { PoolData } from "./usePools";
import { usePools } from "./usePools";

const getPoolMath = ({
  spec: poolSpec,
  state: poolState,
  lpToken,
  tokens: poolTokens,
  poolLpMint,
  poolTokenAccounts,
}: PoolData): PoolMath | null => {
  if (!poolState) {
    return null;
  }

  const poolTokenDecimals = poolTokens.map(
    (tokenSpec) => getSolanaTokenDetails(tokenSpec).decimals,
  );
  const maxDecimals = Math.max(...poolTokenDecimals);
  const tolerance = new Decimal(10).pow(-maxDecimals);
  if (isEvmPoolState(poolState)) {
    return new PoolMath(
      poolState.balances,
      poolState.ampFactor,
      poolState.lpFee,
      poolState.governanceFee,
      poolState.totalLPSupply,
      tolerance,
    );
  }

  if (
    poolLpMint === null ||
    poolTokenAccounts === null ||
    !isEachNotNull(poolTokenAccounts)
  ) {
    return null;
  }

  const tokenBalances = poolTokenAccounts.map((tokenAccount, i) =>
    Amount.fromAtomicBn(poolTokens[i], tokenAccount.amount, EcosystemId.Solana),
  );

  // calculate amp factor
  const ampFactor = bnOrBigNumberToDecimal(
    poolState.ampFactor.targetValue.value,
  );
  // TODO: do correct interpolation with Solana block time

  // lpFee
  const humanLpFee = atomicToHuman(
    new Decimal(poolState.lpFee),
    poolSpec.feeDecimals,
  );

  // governanceFee
  const humanGovernanceFee = atomicToHuman(
    new Decimal(poolState.governanceFee),
    poolSpec.feeDecimals,
  );

  const lpSupply = Amount.fromAtomicBn(
    lpToken,
    poolLpMint.supply,
    EcosystemId.Solana,
  );
  return new PoolMath(
    tokenBalances.map((amount) => amount.toHuman(EcosystemId.Solana)),
    ampFactor,
    humanLpFee,
    humanGovernanceFee,
    lpSupply.toHuman(EcosystemId.Solana),
    tolerance,
  );
};

export const usePoolMaths = (
  poolIds: readonly string[],
): readonly (PoolMath | null)[] => {
  const pools = usePools(poolIds);
  return pools.map(getPoolMath);
};

export const usePoolMath = (poolId: string) => usePoolMaths([poolId])[0];

export const usePoolMathByPoolIds = () => {
  const config = useEnvironment(selectConfig);
  const poolIds = config.pools.map(({ id }) => id);
  const pools = usePools(poolIds);
  return poolIds.reduce(
    (accumulator, id, i) => ({
      ...accumulator,
      [id]: getPoolMath(pools[i]),
    }),
    {},
  );
};
