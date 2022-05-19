import {
  attestFromEth,
  attestFromSolana,
  createWrappedOnEth,
  createWrappedOnSolana,
  getEmitterAddressEth,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  parseSequenceFromLogSolana,
  postVaaSolanaWithRetry,
} from "@certusone/wormhole-sdk";
import type { ContractReceipt } from "ethers";

import type { EvmSpec, WormholeChainSpec, WormholeConfig } from "../../config";
import { EcosystemId, WormholeChainId, ecosystems } from "../../config";
import type { SolanaConnection } from "../solana";
import { DEFAULT_MAX_RETRIES } from "../solana";
import type { EvmWalletAdapter, SolanaWalletAdapter } from "../wallets";

// TODO: Refactor to use Tx instead of CrossChainResult
import type { CrossChainResult } from "./crossChain";

export interface AttestationResult {
  readonly txId: string;
  readonly emitterAddress: string;
  readonly sequence: string;
}

export const attestSplToken = async (
  solanaWormhole: WormholeChainSpec,
  solanaConnection: SolanaConnection,
  solanaWallet: SolanaWalletAdapter,
  mintAddress: string,
): Promise<AttestationResult> => {
  if (!solanaWallet.publicKey) {
    throw new Error("No Solana public key");
  }

  const tx = await attestFromSolana(
    solanaConnection.rawConnection,
    solanaWormhole.bridge,
    solanaWormhole.tokenBridge,
    solanaWallet.publicKey.toBase58(),
    mintAddress,
  );
  const signed = await solanaWallet.signTransaction(tx);
  // NOTE: Wormhole SDK's attestFromSolana doesn't give us the signing key so we can't send with retry
  const txId = await solanaConnection.rawConnection.sendRawTransaction(
    signed.serialize(),
  );
  const info = await solanaConnection.getTx(txId);

  const sequence = parseSequenceFromLogSolana(info);
  const emitterAddress = await getEmitterAddressSolana(
    solanaWormhole.tokenBridge,
  );

  return {
    txId,
    emitterAddress,
    sequence,
  };
};

export const setUpSplTokensOnEvm = async (
  { endpoint }: WormholeConfig,
  solanaWormhole: WormholeChainSpec,
  evmChain: EvmSpec,
  solanaConnection: SolanaConnection,
  solanaWallet: SolanaWalletAdapter,
  evmWallet: EvmWalletAdapter,
  mintAddresses: readonly string[],
): Promise<CrossChainResult> => {
  if (!evmWallet.signer) {
    throw new Error("No EVM chain wallet signer");
  }

  await evmWallet.switchNetwork();

  const attestations = await Promise.all(
    mintAddresses.map((mintAddress) =>
      attestSplToken(
        solanaWormhole,
        solanaConnection,
        solanaWallet,
        mintAddress,
      ),
    ),
  );

  const vaas = await Promise.all(
    attestations.map(({ emitterAddress, sequence }) =>
      getSignedVAAWithRetry(
        [endpoint],
        WormholeChainId.Solana,
        emitterAddress,
        sequence,
      ),
    ),
  );

  let evmReceipts: readonly ContractReceipt[] = [];
  // Use a for loop to ensure the sequence does not get out of order
  for (const { vaaBytes } of vaas) {
    evmReceipts = [
      ...evmReceipts,
      await createWrappedOnEth(
        evmChain.wormhole.tokenBridge,
        evmWallet.signer,
        vaaBytes,
      ),
    ];
  }
  const evmTxIds = evmReceipts.map(({ transactionHash }) => transactionHash);
  return {
    solanaTxIds: attestations.map(({ txId }) => txId),
    ethereumTxIds: evmChain.ecosystem === EcosystemId.Ethereum ? evmTxIds : [],
    bscTxIds: evmChain.ecosystem === EcosystemId.Bsc ? evmTxIds : [],
  };
};

export const attestErc20Token = async (
  evmChain: EvmSpec,
  evmWallet: EvmWalletAdapter,
  tokenContractAddress: string,
): Promise<AttestationResult> => {
  if (!evmWallet.signer) {
    throw new Error("No EVM chain wallet signer");
  }

  await evmWallet.switchNetwork();

  const receipt = await attestFromEth(
    evmChain.wormhole.tokenBridge,
    evmWallet.signer,
    tokenContractAddress,
  );
  const sequence = parseSequenceFromLogEth(receipt, evmChain.wormhole.bridge);
  const emitterAddress = getEmitterAddressEth(evmChain.wormhole.tokenBridge);

  return {
    txId: receipt.transactionHash,
    emitterAddress,
    sequence,
  };
};

export const setUpErc20Tokens = async (
  { endpoint }: WormholeConfig,
  evmChain: EvmSpec,
  solanaWormhole: WormholeChainSpec,
  solanaConnection: SolanaConnection,
  solanaWallet: SolanaWalletAdapter,
  evmWallet: EvmWalletAdapter,
  tokenContractAddresses: readonly string[],
): Promise<CrossChainResult> => {
  let attestations: readonly AttestationResult[] = [];
  // Use a for loop to ensure the sequence does not get out of order
  for (const tokenContractAddress of tokenContractAddresses) {
    attestations = [
      ...attestations,
      await attestErc20Token(evmChain, evmWallet, tokenContractAddress),
    ];
  }

  const evmEcosystem = ecosystems[evmChain.ecosystem];
  const vaas = await Promise.all(
    attestations.map(({ emitterAddress, sequence }) =>
      getSignedVAAWithRetry(
        [endpoint],
        evmEcosystem.wormholeChainId,
        emitterAddress,
        sequence,
      ),
    ),
  );

  await Promise.all(
    vaas.map(({ vaaBytes }) => {
      if (!solanaWallet.publicKey) {
        throw new Error("No Solana public key");
      }
      return postVaaSolanaWithRetry(
        solanaConnection.rawConnection,
        solanaWallet.signTransaction.bind(solanaWallet),
        solanaWormhole.bridge,
        solanaWallet.publicKey.toBase58(),
        Buffer.from(vaaBytes),
        DEFAULT_MAX_RETRIES,
      );
    }),
  );

  const solanaTxIds = await Promise.all(
    vaas.map(async ({ vaaBytes }) => {
      if (!solanaWallet.publicKey) {
        throw new Error("No Solana public key");
      }
      const tx = await createWrappedOnSolana(
        solanaConnection.rawConnection,
        solanaWormhole.bridge,
        solanaWormhole.tokenBridge,
        solanaWallet.publicKey.toBase58(),
        vaaBytes,
      );
      return solanaConnection.sendAndConfirmTx(
        solanaWallet.signTransaction.bind(solanaWallet),
        tx,
      );
    }),
  );

  const evmTxIds = attestations.map(({ txId }) => txId);

  return {
    solanaTxIds,
    ethereumTxIds: evmChain.ecosystem === EcosystemId.Ethereum ? evmTxIds : [],
    bscTxIds: evmChain.ecosystem === EcosystemId.Bsc ? evmTxIds : [],
  };
};