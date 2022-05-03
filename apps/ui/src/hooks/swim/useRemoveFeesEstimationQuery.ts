import Decimal from "decimal.js";

import type { EvmEcosystemId } from "../../config";
import { EcosystemId } from "../../config";
import type { Amount, FeesEstimation } from "../../models";
import {
  APPROVAL_CEILING,
  REDEEM_CEILING,
  SOLANA_FEE,
  TRANSFER_CEILING,
  countNonZeroAmounts,
} from "../../models";

import { useGasPriceQuery } from "./useGasPriceQuery";

const ZERO = new Decimal(0);

const calculateGas = (
  ecosystemId: EvmEcosystemId,
  outputAmounts: readonly (Amount | null)[],
  lpTokenSourceEcosystem: EcosystemId,
): Decimal => {
  const tokenCount = new Decimal(
    countNonZeroAmounts(outputAmounts, ecosystemId),
  );
  const transferFromGas =
    lpTokenSourceEcosystem === ecosystemId
      ? APPROVAL_CEILING + TRANSFER_CEILING
      : ZERO;
  const redeemGas = tokenCount.mul(REDEEM_CEILING);
  return redeemGas.add(transferFromGas);
};

export const useRemoveFeesEstimationQuery = (
  outputAmounts: readonly (Amount | null)[],
  lpTokenSourceEcosystem: EcosystemId,
): FeesEstimation | null => {
  const { data: ethGasPrice = null } = useGasPriceQuery(EcosystemId.Ethereum);
  const { data: bscGasPrice = null } = useGasPriceQuery(EcosystemId.Bsc);
  const { data: avalancheGasPrice = null } = useGasPriceQuery(
    EcosystemId.Avalanche,
  );
  const { data: polygonGasPrice = null } = useGasPriceQuery(
    EcosystemId.Polygon,
  );

  if (
    ethGasPrice === null ||
    bscGasPrice === null ||
    (process.env.REACT_APP_ADDITIONAL_EVM_CHAINS &&
      (avalancheGasPrice === null || polygonGasPrice === null))
  ) {
    return null;
  }

  const evmEcosystemIds: readonly EvmEcosystemId[] = [
    EcosystemId.Ethereum,
    EcosystemId.Bsc,
    EcosystemId.Avalanche,
    EcosystemId.Polygon,
  ];
  const [ethGas, bscGas, avalancheGas, polygonGas] = evmEcosystemIds.map(
    (ecosystemId) =>
      calculateGas(ecosystemId, outputAmounts, lpTokenSourceEcosystem),
  );
  return {
    [EcosystemId.Solana]: SOLANA_FEE,
    [EcosystemId.Ethereum]: ethGas.mul(ethGasPrice.toString()),
    [EcosystemId.Bsc]: bscGas.mul(bscGasPrice.toString()),
    [EcosystemId.Terra]: ZERO,
    [EcosystemId.Avalanche]: process.env.REACT_APP_ADDITIONAL_EVM_CHAINS
      ? avalancheGas.mul(avalancheGasPrice?.toString() ?? ZERO)
      : ZERO,
    [EcosystemId.Polygon]: process.env.REACT_APP_ADDITIONAL_EVM_CHAINS
      ? polygonGas.mul(polygonGasPrice?.toString() ?? ZERO)
      : ZERO,
  };
};
