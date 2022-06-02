/* eslint-disable functional/immutable-data */
import { produce } from "immer";
import type { GetState, SetState } from "zustand";
import create from "zustand";

import { Protocol } from "../../config";
import type {
  EvmWalletAdapter,
  SolanaWalletAdapter,
  WalletAdapter,
} from "../../models";

type AdapterFactory = (serviceId: string, protocol: Protocol) => WalletAdapter;

export interface WalletAdapterState {
  readonly evm: EvmWalletAdapter | null;
  readonly solana: SolanaWalletAdapter | null;
  readonly connectService: (
    serviceId: string,
    protocol: Protocol,
    createAdapter: AdapterFactory,
  ) => Promise<void>;
  readonly disconnectService: (protocol: Protocol) => Promise<void>;
}

export const useWalletAdapter = create<WalletAdapterState>(
  (set: SetState<WalletAdapterState>, get: GetState<WalletAdapterState>) => ({
    evm: null,
    solana: null,
    connectService: async (
      serviceId: string,
      protocol: Protocol,
      createAdapter,
    ) => {
      const state = get();
      const previous = protocol === Protocol.Evm ? state.evm : state.solana;

      if (previous) await state.disconnectService(protocol);

      const adapter = createAdapter(serviceId, protocol);

      set(
        produce<WalletAdapterState>((draft) => {
          switch (adapter.protocol) {
            case Protocol.Evm: {
              draft.evm = adapter;
              break;
            }
            case Protocol.Solana: {
              draft.solana = adapter;
              break;
            }
          }
        }),
      );

      await adapter.connect().catch(console.error);
    },
    disconnectService: async (protocol: Protocol) => {
      const state = get();
      const adapter = protocol === Protocol.Evm ? state.evm : state.solana;
      await adapter?.disconnect().catch(console.error);

      set(
        produce<WalletAdapterState>((draft) => {
          switch (protocol) {
            case Protocol.Evm: {
              draft.evm = null;
              break;
            }
            case Protocol.Solana: {
              draft.solana = null;
              break;
            }
            case Protocol.Cosmos: {
              throw new Error(`Cosmos disconnect not implemented`);
            }
          }
        }),
      );
    },
  }),
);
