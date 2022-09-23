import { aptos } from "@swim-io/aptos";
import Decimal from "decimal.js";
import type { UseQueryOptions, UseQueryResult } from "react-query";
import { useQuery } from "react-query";

import { useEnvironment } from "../../core/store";

import { useAptosClient } from "./useAptosClient";
import { useAptosWallet } from "./useAptosWallet";

export const useAptosGasBalanceQuery = (
  options?: UseQueryOptions<Decimal, Error>,
): UseQueryResult<Decimal, Error> => {
  const { env } = useEnvironment();
  const aptosClient = useAptosClient();
  const { address: walletAddress } = useAptosWallet();
  return useQuery<Decimal, Error>(
    [env, "aptosGasBalance", walletAddress],
    async () => {
      if (!walletAddress) {
        return new Decimal(0);
      }
      try {
        return (await aptosClient.getGasBalance(walletAddress)).dividedBy(
          new Decimal("10").pow(aptos.gasToken.decimals),
        );
      } catch {
        return new Decimal(0);
      }
    },
    options,
  );
};
