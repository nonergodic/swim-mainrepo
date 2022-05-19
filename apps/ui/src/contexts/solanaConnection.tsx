/* eslint-disable functional/immutable-data, functional/prefer-readonly-type */
import { Keypair } from "@solana/web3.js";
import type { ReactElement, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";

import { DEFAULT_ENV, configs } from "../config";
import { Protocol } from "../config/ecosystem";
import { SolanaConnection } from "../models";

import { useConfig } from "./environment";

const SolanaConnectionContext = createContext<SolanaConnection>(
  new SolanaConnection(
    configs[DEFAULT_ENV].chains[Protocol.Solana][0].endpoint,
  ),
);

export const SolanaConnectionProvider = ({
  children,
}: {
  readonly children?: ReactNode;
}): ReactElement => {
  const { chains } = useConfig();
  const [chain] = chains[Protocol.Solana];
  const { endpoint } = chain;

  const solanaConnection = useMemo(
    () => new SolanaConnection(endpoint),
    [endpoint],
  );

  // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
  // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
  // This is a hack to prevent the list from ever getting empty
  useEffect(() => {
    const subscriptionId = solanaConnection.onAccountChange(
      Keypair.generate().publicKey,
      () => {},
    );
    return () => {
      solanaConnection
        .removeAccountChangeListener(subscriptionId)
        .catch(console.error);
    };
  }, [solanaConnection]);

  return (
    <SolanaConnectionContext.Provider value={solanaConnection}>
      {children}
    </SolanaConnectionContext.Provider>
  );
};

export const useSolanaConnection = (): SolanaConnection =>
  useContext(SolanaConnectionContext);