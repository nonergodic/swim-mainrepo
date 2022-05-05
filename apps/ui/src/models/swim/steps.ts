import type { AccountInfo as TokenAccount } from "@solana/spl-token";

import { EcosystemId, getSolanaTokenDetails } from "../../config";
import type {
  ChainsByProtocol,
  Config,
  PoolSpec,
  TokenSpec,
} from "../../config";
import type { ReadonlyRecord } from "../../utils";
import { findOrThrow } from "../../utils";
import { Amount } from "../amount";
import type { SolanaTx, Tx, TxsByTokenId } from "../crossEcosystem";
import { findTokenAccountForMint } from "../solana";
import { isTransferFromTx, isTransferToTx } from "../wormhole";

import type {
  AddInteraction,
  Interaction,
  InteractionSpec,
  RemoveExactBurnInteraction,
  RemoveExactOutputInteraction,
  RemoveUniformInteraction,
  SwapInteraction,
} from "./interaction";
import { InteractionType } from "./interaction";
import type { TokensByPoolId } from "./pool";
import { getTokensByPool, isPoolTx } from "./pool";
import type {
  ProtoTransfer,
  Transfer,
  TransferToSolana,
  Transfers,
} from "./transfer";
import {
  TransferType,
  generateInputTransfers,
  generateLpInTransfer,
  generateLpOutProtoTransfer,
  generateOutputProtoTransfers,
  generateOutputTransfers,
  generateSingleOutputProtoTransfers,
} from "./transfer";

export const enum StepType {
  CreateSplTokenAccounts,
  WormholeToSolana,
  SolanaOperations,
  WormholeFromSolana,
}

export interface BaseStep {
  readonly type: StepType;
  readonly isComplete: boolean;
}

export interface CreateSplTokenAccountsStep extends BaseStep {
  readonly type: StepType.CreateSplTokenAccounts;
  readonly mints: readonly string[];
  readonly txs: readonly Tx[];
}

export interface WormholeToSolanaStep extends BaseStep {
  readonly type: StepType.WormholeToSolana;
  readonly knownAmounts: true;
  readonly transfers: Transfers<TransferToSolana>;
  readonly txs: TxsByTokenId;
}

export interface SolanaOperationsStep extends BaseStep {
  readonly type: StepType.SolanaOperations;
  readonly txs: readonly Tx[];
}

export interface WormholeFromSolanaFullStep extends BaseStep {
  readonly type: StepType.WormholeFromSolana;
  readonly knownAmounts: true;
  readonly transfers: Transfers<Transfer>;
  readonly txs: TxsByTokenId;
}

export interface WormholeFromSolanaProtoStep extends BaseStep {
  readonly type: StepType.WormholeFromSolana;
  readonly knownAmounts: false;
  readonly transfers: Transfers<ProtoTransfer>;
  readonly txs: TxsByTokenId;
}

export type WormholeFromSolanaStep =
  | WormholeFromSolanaFullStep
  | WormholeFromSolanaProtoStep;

export type Step =
  | CreateSplTokenAccountsStep
  | WormholeToSolanaStep
  | SolanaOperationsStep
  | WormholeFromSolanaStep;

export type Steps<F extends WormholeFromSolanaStep = WormholeFromSolanaStep> = {
  readonly createSplTokenAccounts: CreateSplTokenAccountsStep;
  readonly wormholeToSolana: WormholeToSolanaStep;
  readonly doPoolOperations: SolanaOperationsStep;
  readonly wormholeFromSolana: F;
};

export interface TxsByStep {
  readonly [StepType.CreateSplTokenAccounts]: readonly SolanaTx[];
  readonly [StepType.WormholeToSolana]: TxsByTokenId;
  readonly [StepType.SolanaOperations]: readonly SolanaTx[];
  readonly [StepType.WormholeFromSolana]: TxsByTokenId;
}

export const isWormholeFromSolanaFullStep = (
  wormholeFromSolanaStep: WormholeFromSolanaStep,
): wormholeFromSolanaStep is WormholeFromSolanaFullStep =>
  wormholeFromSolanaStep.knownAmounts;

export const getRequiredTokens = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interactionSpec: InteractionSpec,
): readonly TokenSpec[] => {
  switch (interactionSpec.type) {
    case InteractionType.Add: {
      const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
      return [
        ...tokens.filter((token) => {
          const inputAmount =
            interactionSpec.params.inputAmounts.get(token.id) ?? null;
          return inputAmount !== null && !inputAmount.isZero();
        }),
        lpToken,
      ];
    }
    case InteractionType.RemoveUniform: {
      const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
      return [
        ...tokens.filter((token) => {
          const outputAmount =
            interactionSpec.params.minimumOutputAmounts.get(token.id) ?? null;
          return outputAmount !== null && !outputAmount.isZero();
        }),
        lpToken,
      ];
    }
    case InteractionType.RemoveExactBurn: {
      const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
      return [
        ...tokens.filter(
          (token) => interactionSpec.params.outputTokenId === token.id,
        ),
        lpToken,
      ];
    }
    case InteractionType.RemoveExactOutput: {
      const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
      return [
        ...tokens.filter((token) => {
          const outputAmount =
            interactionSpec.params.exactOutputAmounts.get(token.id) ?? null;
          return outputAmount !== null && !outputAmount.isZero();
        }),
        lpToken,
      ];
    }
    case InteractionType.Swap: {
      const inputPool = poolSpecs[0];
      const outputPool = poolSpecs[poolSpecs.length - 1];
      const inputTokenIds = [
        ...interactionSpec.params.exactInputAmounts.keys(),
      ];
      const inputTokens = inputTokenIds.map((tokenId) =>
        findOrThrow(
          tokensByPoolId[inputPool.id].tokens,
          (token) => token.id === tokenId,
        ),
      );
      const filteredInputTokens = inputTokens.filter((token) => {
        const inputAmount =
          interactionSpec.params.exactInputAmounts.get(token.id) ?? null;
        return inputAmount !== null && !inputAmount.isZero();
      });
      const outputToken = findOrThrow(
        tokensByPoolId[outputPool.id].tokens,
        (token) => token.id === interactionSpec.params.outputTokenId,
      );
      if (inputPool.id === outputPool.id) {
        return [...filteredInputTokens, outputToken];
      }

      // TODO: Better validation
      const lpToken =
        tokensByPoolId[inputPool.id].tokens.find(
          (token) => token.id === outputPool.lpToken,
        ) ??
        tokensByPoolId[outputPool.id].tokens.find(
          (token) => token.id === inputPool.lpToken,
        ) ??
        null;
      if (lpToken === null) {
        throw new Error("Invalid swap route");
      }
      return [...filteredInputTokens, lpToken, outputToken];
    }
    default:
      throw new Error("Unsupported instruction");
  }
};

export const findMissingSplTokenAccountMints = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: Interaction,
  splTokenAccounts: readonly TokenAccount[],
): readonly string[] => {
  const requiredTokens = getRequiredTokens(
    tokensByPoolId,
    poolSpecs,
    interaction,
  );
  return requiredTokens
    .map((token) => getSolanaTokenDetails(token).address)
    .filter((mintAddress) => {
      const walletAddress = interaction.connectedWallets[EcosystemId.Solana];
      if (walletAddress === null) {
        throw new Error("Missing Solana wallet");
      }
      const associatedTokenAccount = findTokenAccountForMint(
        mintAddress,
        walletAddress,
        splTokenAccounts,
      );
      return associatedTokenAccount === null;
    });
};

export const createAddSteps = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: AddInteraction,
  splTokenAccounts: readonly TokenAccount[],
  txsByStep: TxsByStep,
): Steps => {
  const { id: interactionId, params, lpTokenTargetEcosystem } = interaction;
  const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
  const missingTokenAccountMints = findMissingSplTokenAccountMints(
    tokensByPoolId,
    poolSpecs,
    interaction,
    splTokenAccounts,
  );
  return {
    createSplTokenAccounts: {
      type: StepType.CreateSplTokenAccounts,
      isComplete: false,
      txs: txsByStep[StepType.CreateSplTokenAccounts],
      mints: missingTokenAccountMints,
    },
    wormholeToSolana: {
      type: StepType.WormholeToSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeToSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateInputTransfers(
          interactionId,
          splTokenAccounts,
          tokens,
          tokens.map(
            (token) => params.inputAmounts.get(token.id) ?? Amount.zero(token),
          ),
          interaction.signatureSetKeypairs,
        ),
      },
    },
    doPoolOperations: {
      type: StepType.SolanaOperations,
      isComplete: false,
      txs: txsByStep[StepType.SolanaOperations],
    },
    wormholeFromSolana: {
      type: StepType.WormholeFromSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeFromSolana],
      knownAmounts: false,
      transfers: {
        type: TransferType.LpToken,
        lpToken: generateLpOutProtoTransfer(
          interactionId,
          lpToken,
          lpTokenTargetEcosystem,
        ),
      },
    },
  };
};

export const createRemoveUniformSteps = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: RemoveUniformInteraction,
  splTokenAccounts: readonly TokenAccount[],
  txsByStep: TxsByStep,
): Steps => {
  const { id: interactionId, params, lpTokenSourceEcosystem } = interaction;
  const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
  const missingTokenAccountMints = findMissingSplTokenAccountMints(
    tokensByPoolId,
    poolSpecs,
    interaction,
    splTokenAccounts,
  );
  return {
    createSplTokenAccounts: {
      type: StepType.CreateSplTokenAccounts,
      isComplete: false,
      txs: txsByStep[StepType.CreateSplTokenAccounts],
      mints: missingTokenAccountMints,
    },
    wormholeToSolana: {
      type: StepType.WormholeToSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeToSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.LpToken,
        lpToken: generateLpInTransfer(
          interactionId,
          lpToken,
          params.exactBurnAmount,
          lpTokenSourceEcosystem,
          interaction.signatureSetKeypairs,
        ),
      },
    },
    doPoolOperations: {
      type: StepType.SolanaOperations,
      isComplete: false,
      txs: txsByStep[StepType.SolanaOperations],
    },
    wormholeFromSolana: {
      type: StepType.WormholeFromSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeFromSolana],
      knownAmounts: false,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateOutputProtoTransfers(
          interactionId,
          splTokenAccounts,
          tokens,
        ),
      },
    },
  };
};

export const createRemoveExactBurnSteps = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: RemoveExactBurnInteraction,
  splTokenAccounts: readonly TokenAccount[],
  txsByStep: TxsByStep,
): Steps => {
  const { id: interactionId, params, lpTokenSourceEcosystem } = interaction;
  const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
  const missingTokenAccountMints = findMissingSplTokenAccountMints(
    tokensByPoolId,
    poolSpecs,
    interaction,
    splTokenAccounts,
  );
  const outputTokenIndex = tokens.findIndex(
    (token) => token.id === params.outputTokenId,
  );
  if (outputTokenIndex === -1) {
    throw new Error("Invalid output token");
  }

  return {
    createSplTokenAccounts: {
      type: StepType.CreateSplTokenAccounts,
      isComplete: false,
      txs: txsByStep[StepType.CreateSplTokenAccounts],
      mints: missingTokenAccountMints,
    },
    wormholeToSolana: {
      type: StepType.WormholeToSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeToSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.LpToken,
        lpToken: generateLpInTransfer(
          interactionId,
          lpToken,
          params.exactBurnAmount,
          lpTokenSourceEcosystem,
          interaction.signatureSetKeypairs,
        ),
      },
    },
    doPoolOperations: {
      type: StepType.SolanaOperations,
      isComplete: false,
      txs: txsByStep[StepType.SolanaOperations],
    },
    wormholeFromSolana: {
      type: StepType.WormholeFromSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeFromSolana],
      knownAmounts: false,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateSingleOutputProtoTransfers(
          interactionId,
          tokens,
          outputTokenIndex,
        ),
      },
    },
  };
};

export const createRemoveExactOutputSteps = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: RemoveExactOutputInteraction,
  splTokenAccounts: readonly TokenAccount[],
  txsByStep: TxsByStep,
): Steps => {
  const { id: interactionId, params, lpTokenSourceEcosystem } = interaction;
  const { tokens, lpToken } = tokensByPoolId[poolSpecs[0].id];
  const missingTokenAccountMints = findMissingSplTokenAccountMints(
    tokensByPoolId,
    poolSpecs,
    interaction,
    splTokenAccounts,
  );

  return {
    createSplTokenAccounts: {
      type: StepType.CreateSplTokenAccounts,
      isComplete: false,
      txs: txsByStep[StepType.CreateSplTokenAccounts],
      mints: missingTokenAccountMints,
    },
    wormholeToSolana: {
      type: StepType.WormholeToSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeToSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.LpToken,
        lpToken: generateLpInTransfer(
          interactionId,
          lpToken,
          params.maximumBurnAmount,
          lpTokenSourceEcosystem,
          interaction.signatureSetKeypairs,
        ),
      },
    },
    doPoolOperations: {
      type: StepType.SolanaOperations,
      isComplete: false,
      txs: txsByStep[StepType.SolanaOperations],
    },
    wormholeFromSolana: {
      type: StepType.WormholeFromSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeFromSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateOutputTransfers(
          interactionId,
          splTokenAccounts,
          tokens,
          tokens.map(
            (token) =>
              params.exactOutputAmounts.get(token.id) ?? Amount.zero(token),
          ),
        ),
      },
    },
  };
};

export const createSwapSteps = (
  tokensByPoolId: TokensByPoolId,
  poolSpecs: readonly PoolSpec[],
  interaction: SwapInteraction,
  splTokenAccounts: readonly TokenAccount[],
  txsByStep: TxsByStep,
): Steps => {
  const { id: interactionId, params } = interaction;
  // TODO: Multiple pools
  const { tokens } = tokensByPoolId[poolSpecs[0].id];
  const missingTokenAccountMints = findMissingSplTokenAccountMints(
    tokensByPoolId,
    poolSpecs,
    interaction,
    splTokenAccounts,
  );
  const outputTokenIndex = tokens.findIndex(
    (token) => token.id === params.outputTokenId,
  );
  if (outputTokenIndex === -1) {
    throw new Error("Invalid output token");
  }

  return {
    createSplTokenAccounts: {
      type: StepType.CreateSplTokenAccounts,
      isComplete: false,
      txs: txsByStep[StepType.CreateSplTokenAccounts],
      mints: missingTokenAccountMints,
    },
    wormholeToSolana: {
      type: StepType.WormholeToSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeToSolana],
      knownAmounts: true,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateInputTransfers(
          interactionId,
          splTokenAccounts,
          tokens,
          tokens.map(
            (token) =>
              params.exactInputAmounts.get(token.id) ?? Amount.zero(token),
          ),
          interaction.signatureSetKeypairs,
        ),
      },
    },
    doPoolOperations: {
      type: StepType.SolanaOperations,
      isComplete: false,
      txs: txsByStep[StepType.SolanaOperations],
    },
    wormholeFromSolana: {
      type: StepType.WormholeFromSolana,
      isComplete: false,
      txs: txsByStep[StepType.WormholeFromSolana],
      knownAmounts: false,
      transfers: {
        type: TransferType.Tokens,
        tokens: generateSingleOutputProtoTransfers(
          interactionId,
          tokens,
          outputTokenIndex,
        ),
      },
    },
  };
};

export const getTransferToTxs = (
  chains: ChainsByProtocol,
  walletAddress: string,
  splTokenAccounts: readonly TokenAccount[],
  tokens: readonly TokenSpec[],
  lpToken: TokenSpec,
  signatureSetAddresses: ReadonlyRecord<string, string | undefined>,
  txs: readonly Tx[],
): TxsByTokenId =>
  [lpToken, ...tokens].reduce((accumulator, token) => {
    const solanaMint = getSolanaTokenDetails(token).address;
    const signatureSetAddress = signatureSetAddresses[token.id] ?? null;
    const txsForToken = txs.filter((tx) =>
      isTransferToTx(
        chains,
        walletAddress,
        splTokenAccounts,
        token,
        solanaMint,
        signatureSetAddress,
        tx,
      ),
    );
    return {
      ...accumulator,
      // NOTE: txs arrive most recent first
      [token.id]: [...txsForToken].reverse(),
    };
  }, {});

export const findPoolOperationTxs = (
  poolSpecs: readonly PoolSpec[],
  txs: readonly Tx[],
): readonly SolanaTx[] =>
  txs.filter<SolanaTx>((tx): tx is SolanaTx =>
    poolSpecs.some((poolSpec) => isPoolTx(poolSpec.id, tx)),
  );

export const getTransferFromTxs = (
  chainsConfig: ChainsByProtocol,
  walletAddress: string,
  splTokenAccounts: readonly TokenAccount[],
  tokens: readonly TokenSpec[],
  lpToken: TokenSpec,
  txs: readonly Tx[],
): TxsByTokenId => {
  return [lpToken, ...tokens].reduce((accumulator, token) => {
    const txsForToken = txs.filter((tx) =>
      isTransferFromTx(
        chainsConfig,
        walletAddress,
        splTokenAccounts,
        token,
        tx,
      ),
    );
    return {
      ...accumulator,
      // NOTE: txs arrive most recent first
      [token.id]: [...txsForToken].reverse(),
    };
  }, {});
};

/** Returns one or two pools involved in the interaction */
export const getRelevantPools = (
  poolSpecs: readonly PoolSpec[],
  interactionSpec: InteractionSpec,
): readonly PoolSpec[] => {
  switch (interactionSpec.type) {
    case InteractionType.Add:
      return [
        findOrThrow(
          poolSpecs,
          (poolSpec) =>
            poolSpec.lpToken ===
            interactionSpec.params.minimumMintAmount.tokenId,
        ),
      ];
    case InteractionType.RemoveUniform:
    case InteractionType.RemoveExactBurn:
      return [
        findOrThrow(
          poolSpecs,
          (poolSpec) =>
            poolSpec.lpToken === interactionSpec.params.exactBurnAmount.tokenId,
        ),
      ];
    case InteractionType.RemoveExactOutput:
      return [
        findOrThrow(
          poolSpecs,
          (poolSpec) =>
            poolSpec.lpToken ===
            interactionSpec.params.maximumBurnAmount.tokenId,
        ),
      ];
    case InteractionType.Swap: {
      const inputTokenIds = [
        ...interactionSpec.params.exactInputAmounts.keys(),
      ];
      const { outputTokenId } = interactionSpec.params;
      const singlePool =
        poolSpecs.find((poolSpec) =>
          [...inputTokenIds, outputTokenId].every((tokenId) =>
            poolSpec.tokenAccounts.has(tokenId),
          ),
        ) ?? null;
      if (singlePool !== null) {
        return [singlePool];
      }
      // NOTE: We assume a maximum of two pools
      const inputPool = findOrThrow(poolSpecs, (poolSpec) =>
        inputTokenIds.every((tokenId) => poolSpec.tokenAccounts.has(tokenId)),
      );
      const outputPool = findOrThrow(poolSpecs, (poolSpec) =>
        poolSpec.tokenAccounts.has(outputTokenId),
      );
      return [inputPool, outputPool];
    }
    default:
      throw new Error("Unknown interaction kind");
  }
};

export const createSteps = (
  config: Config,
  interaction: Interaction,
  splTokenAccounts: readonly TokenAccount[],
  txs: readonly Tx[],
): Steps => {
  const walletAddress = interaction.connectedWallets[EcosystemId.Solana];
  if (walletAddress === null) {
    throw new Error("Missing Solana wallet");
  }
  const tokensByPool = getTokensByPool(config);
  const relevantPools = getRelevantPools(config.pools, interaction);
  const inputPool = relevantPools[0];
  const outputPool = relevantPools[relevantPools.length - 1];
  const inputPoolTokens = tokensByPool[inputPool.id];
  const outputPoolTokens = tokensByPool[outputPool.id];

  const createSplTokenAccountsTxs: readonly SolanaTx[] = [];
  const wormholeToSolanaTxs = getTransferToTxs(
    config.chains,
    walletAddress,
    splTokenAccounts,
    inputPoolTokens.tokens,
    inputPoolTokens.lpToken,
    interaction.previousSignatureSetAddresses,
    txs,
  );
  const poolOperationTxs = findPoolOperationTxs(relevantPools, txs);
  const wormholeFromSolanaTxs = getTransferFromTxs(
    config.chains,
    walletAddress,
    splTokenAccounts,
    outputPoolTokens.tokens,
    outputPoolTokens.lpToken,
    txs,
  );
  const txsByStep: TxsByStep = {
    [StepType.CreateSplTokenAccounts]: createSplTokenAccountsTxs,
    [StepType.WormholeToSolana]: wormholeToSolanaTxs,
    [StepType.SolanaOperations]: poolOperationTxs,
    [StepType.WormholeFromSolana]: wormholeFromSolanaTxs,
  };
  switch (interaction.type) {
    case InteractionType.Add:
      return createAddSteps(
        tokensByPool,
        relevantPools,
        interaction,
        splTokenAccounts,
        txsByStep,
      );
    case InteractionType.Swap:
      return createSwapSteps(
        tokensByPool,
        relevantPools,
        interaction,
        splTokenAccounts,
        txsByStep,
      );
    case InteractionType.RemoveUniform:
      return createRemoveUniformSteps(
        tokensByPool,
        relevantPools,
        interaction,
        splTokenAccounts,
        txsByStep,
      );
    case InteractionType.RemoveExactBurn:
      return createRemoveExactBurnSteps(
        tokensByPool,
        relevantPools,
        interaction,
        splTokenAccounts,
        txsByStep,
      );
    case InteractionType.RemoveExactOutput:
      return createRemoveExactOutputSteps(
        tokensByPool,
        relevantPools,
        interaction,
        splTokenAccounts,
        txsByStep,
      );
    default:
      throw new Error("Interaction type not supported");
  }
};
