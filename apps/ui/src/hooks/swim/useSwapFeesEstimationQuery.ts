import Decimal from "decimal.js";

import type { EvmEcosystemId, TokenSpec } from "../../config";
import { EcosystemId, isEvmEcosystemId } from "../../config";
import type { FeesEstimation } from "../../models";
import {
  APPROVAL_CEILING,
  REDEEM_CEILING,
  SOLANA_FEE,
  TRANSFER_CEILING,
} from "../../models";

import { useGasPriceQuery } from "./useGasPriceQuery";
import { useIsEvmGasPriceLoading } from "./useIsEvmGasPriceLoading";

const ZERO = new Decimal(0);

const calculateGas = (
  ecosystemId: EvmEcosystemId,
  fromToken: TokenSpec | null,
  toToken: TokenSpec | null,
): Decimal => {
  const fromRequirements =
    fromToken?.nativeEcosystem === ecosystemId
      ? [APPROVAL_CEILING, TRANSFER_CEILING]
      : [];
  const toRequirements =
    toToken?.nativeEcosystem === ecosystemId ? [REDEEM_CEILING] : [];
  return [...fromRequirements, ...toRequirements].reduce(
    (acc, requirement) => acc.plus(requirement),
    ZERO,
  );
};

export const useSwapFeesEstimationQuery = (
  fromToken: TokenSpec | null,
  toToken: TokenSpec | null,
): FeesEstimation | null => {
  const [
    ethGasPrice,
    bscGasPrice,
    avalancheGasPrice,
    polygonGasPrice,
    auroraGasPrice,
    fantomGasPrice,
    karuraGasPrice,
    acalaGasPrice,
  ] = [
    useGasPriceQuery(EcosystemId.Ethereum).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Bsc).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Avalanche).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Polygon).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Aurora).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Fantom).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Karura).data ?? ZERO,
    useGasPriceQuery(EcosystemId.Acala).data ?? ZERO,
  ];
  const requiredEvmEcosystemIds = [
    fromToken?.nativeEcosystem,
    toToken?.nativeEcosystem,
  ].filter(
    (ecosystemId): ecosystemId is EvmEcosystemId =>
      ecosystemId !== undefined && isEvmEcosystemId(ecosystemId),
  );
  const isRequiredGasPriceLoading = useIsEvmGasPriceLoading(
    requiredEvmEcosystemIds,
  );
  if (isRequiredGasPriceLoading) {
    return null;
  }
  const evmEcosystemIds: readonly EvmEcosystemId[] = [
    EcosystemId.Ethereum,
    EcosystemId.Bsc,
    EcosystemId.Avalanche,
    EcosystemId.Polygon,
    EcosystemId.Aurora,
    EcosystemId.Fantom,
    EcosystemId.Karura,
    EcosystemId.Acala,
  ];
  const [
    ethGas,
    bscGas,
    avalancheGas,
    polygonGas,
    auroraGas,
    fantomGas,
    karuraGas,
    acalaGas,
  ] = evmEcosystemIds.map((ecosystemId: EvmEcosystemId) =>
    calculateGas(ecosystemId, fromToken, toToken),
  );

  return {
    [EcosystemId.Solana]: SOLANA_FEE,
    [EcosystemId.Ethereum]: ethGas.mul(ethGasPrice.toString()),
    [EcosystemId.Bsc]: bscGas.mul(bscGasPrice.toString()),
    [EcosystemId.Terra]: ZERO,
    [EcosystemId.Avalanche]: avalancheGas.mul(avalancheGasPrice.toString()),
    [EcosystemId.Polygon]: polygonGas.mul(polygonGasPrice.toString()),
    [EcosystemId.Aurora]: auroraGas.mul(auroraGasPrice.toString()),
    [EcosystemId.Fantom]: fantomGas.mul(fantomGasPrice.toString()),
    [EcosystemId.Karura]: karuraGas.mul(karuraGasPrice.toString()),
    [EcosystemId.Acala]: acalaGas.mul(acalaGasPrice.toString()),
  };
};
