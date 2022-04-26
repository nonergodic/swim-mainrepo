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
  amounts: readonly (Amount | null)[],
  lpTargetEcosystem: EcosystemId,
): Decimal => {
  const tokenCount = new Decimal(countNonZeroAmounts(amounts, ecosystemId));
  const transferToGas = tokenCount.mul(APPROVAL_CEILING + TRANSFER_CEILING);
  const redeemGas = lpTargetEcosystem === ecosystemId ? REDEEM_CEILING : ZERO;
  return transferToGas.add(redeemGas);
};

export const useAddFeesEstimationQuery = (
  amounts: readonly (Amount | null)[],
  lpTargetEcosystem: EcosystemId,
): FeesEstimation | null => {
  const { data: ethGasPrice } = useGasPriceQuery(EcosystemId.Ethereum);
  const { data: bscGasPrice } = useGasPriceQuery(EcosystemId.Bsc);
  const { data: avalancheGasPrice } = useGasPriceQuery(EcosystemId.Avalanche);
  const { data: polygonGasPrice } = useGasPriceQuery(EcosystemId.Polygon);

  if (!ethGasPrice || !bscGasPrice || !avalancheGasPrice || !polygonGasPrice) {
    return null;
  }
  const evmEcosystemIds: readonly EvmEcosystemId[] = [
    EcosystemId.Ethereum,
    EcosystemId.Bsc,
    EcosystemId.Avalanche,
    EcosystemId.Polygon,
  ];
  const [ethGas, bscGas, avalancheGas, polygonGas] = evmEcosystemIds.map(
    (ecosystemId) => calculateGas(ecosystemId, amounts, lpTargetEcosystem),
  );
  return {
    [EcosystemId.Solana]: SOLANA_FEE,
    [EcosystemId.Ethereum]: ethGas.mul(ethGasPrice.toString()),
    [EcosystemId.Bsc]: bscGas.mul(bscGasPrice.toString()),
    [EcosystemId.Terra]: ZERO,
    [EcosystemId.Avalanche]: avalancheGas.mul(avalancheGasPrice.toString()),
    [EcosystemId.Polygon]: polygonGas.mul(polygonGasPrice.toString()),
  };
};
