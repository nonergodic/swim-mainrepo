import Decimal from "decimal.js";

import { BNtoDecimal, atomicToHuman } from "../../amounts";
import { EcosystemId, getSolanaTokenDetails } from "../../config";
import { Amount, PoolMath } from "../../models";
import { isEachNotNull } from "../../utils";

import { usePool } from "./usePool";

export const usePoolMath = (poolId: string): PoolMath | null => {
  const {
    spec: poolSpec,
    state: poolState,
    lpToken,
    tokens: poolTokens,
    poolLpMint,
    poolTokenAccounts,
  } = usePool(poolId);

  if (
    !poolState ||
    poolLpMint === null ||
    poolTokenAccounts === null ||
    !isEachNotNull(poolTokenAccounts)
  ) {
    return null;
  }

  const poolTokenDecimals = poolTokens.map(
    (tokenSpec) => getSolanaTokenDetails(tokenSpec).decimals,
  );

  const tokenBalances = poolTokenAccounts.map((tokenAccount, i) =>
    Amount.fromAtomicBn(poolTokens[i], tokenAccount.amount, EcosystemId.Solana),
  );

  // calculate amp factor
  const ampFactor = BNtoDecimal(poolState.ampFactor.targetValue.value);
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
  const maxDecimals = Math.max(...poolTokenDecimals);
  const tolerance = new Decimal(10).pow(-maxDecimals);

  return new PoolMath(
    tokenBalances.map((amount) => amount.toHuman(EcosystemId.Solana)),
    ampFactor,
    humanLpFee,
    humanGovernanceFee,
    lpSupply.toHuman(EcosystemId.Solana),
    tolerance,
  );
};
