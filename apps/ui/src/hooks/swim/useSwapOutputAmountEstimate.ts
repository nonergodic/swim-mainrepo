import { useMemo } from "react";

import type { TokenSpec } from "../../config";
import { EcosystemId } from "../../config";
import type { PoolMath } from "../../models";
import { Amount, SwimDefiInstruction } from "../../models";
import { isEachNotNull } from "../../utils";

interface PoolTokens {
  readonly tokens: readonly TokenSpec[];
  readonly lpToken: TokenSpec;
}

const routeSwap = (
  inputPoolTokens: PoolTokens,
  outputPoolTokens: PoolTokens,
  toToken: TokenSpec,
): {
  readonly inputPoolInstruction:
    | SwimDefiInstruction.Add
    | SwimDefiInstruction.Swap;
  readonly inputPoolOutputTokenIndex: number | null;
  readonly outputPoolInstruction:
    | SwimDefiInstruction.Swap
    | SwimDefiInstruction.RemoveExactBurn
    | null;
  readonly outputPoolInputToken: TokenSpec | null;
} => {
  if (inputPoolTokens.lpToken.id === outputPoolTokens.lpToken.id) {
    const inputPoolIndexOfToToken = inputPoolTokens.tokens.findIndex(
      (token) => token.id === toToken.id,
    );
    if (inputPoolIndexOfToToken === -1) {
      throw new Error("Invalid swap route");
    }
    return {
      inputPoolInstruction: SwimDefiInstruction.Swap,
      inputPoolOutputTokenIndex: inputPoolIndexOfToToken,
      outputPoolInstruction: null,
      outputPoolInputToken: null,
    };
  }
  if (
    outputPoolTokens.tokens.some(
      (token) => token.id === inputPoolTokens.lpToken.id,
    )
  ) {
    return {
      inputPoolInstruction: SwimDefiInstruction.Add,
      inputPoolOutputTokenIndex: null,
      outputPoolInstruction: SwimDefiInstruction.Swap,
      outputPoolInputToken: inputPoolTokens.lpToken,
    };
  }
  const inputPoolIndexOfOutputPoolLpToken = inputPoolTokens.tokens.findIndex(
    (token) => token.id === outputPoolTokens.lpToken.id,
  );
  if (inputPoolIndexOfOutputPoolLpToken !== -1) {
    return {
      inputPoolInstruction: SwimDefiInstruction.Swap,
      inputPoolOutputTokenIndex: inputPoolIndexOfOutputPoolLpToken,
      outputPoolInstruction: SwimDefiInstruction.RemoveExactBurn,
      outputPoolInputToken: outputPoolTokens.lpToken,
    };
  }
  const inputPoolIndexOfSharedToken = inputPoolTokens.tokens.findIndex(
    (inputPoolToken) =>
      outputPoolTokens.tokens.some(
        (outputPoolToken) => outputPoolToken.id === inputPoolToken.id,
      ),
  );
  if (inputPoolIndexOfSharedToken === -1) {
    throw new Error("Invalid swap route");
  }
  return {
    inputPoolInstruction: SwimDefiInstruction.Swap,
    inputPoolOutputTokenIndex: inputPoolIndexOfSharedToken,
    outputPoolInstruction: SwimDefiInstruction.Swap,
    outputPoolInputToken: inputPoolTokens.tokens[inputPoolIndexOfSharedToken],
  };
};

export const useSwapOutputAmountEstimate = (
  poolMaths: readonly (PoolMath | null)[],
  inputPoolTokens: {
    readonly tokens: readonly TokenSpec[];
    readonly lpToken: TokenSpec;
  } | null,
  outputPoolTokens: {
    readonly tokens: readonly TokenSpec[];
    readonly lpToken: TokenSpec;
  } | null,
  toToken: TokenSpec | null,
  exactInputAmounts: readonly Amount[] | null,
): Amount | null =>
  useMemo<Amount | null>(() => {
    if (
      ![1, 2].includes(poolMaths.length) ||
      !isEachNotNull(poolMaths) ||
      inputPoolTokens === null ||
      outputPoolTokens === null ||
      exactInputAmounts === null ||
      toToken === null
    ) {
      return null;
    }

    const inputPoolMath = poolMaths[0];
    const {
      inputPoolInstruction,
      inputPoolOutputTokenIndex,
      outputPoolInstruction,
      outputPoolInputToken,
    } = routeSwap(inputPoolTokens, outputPoolTokens, toToken);

    let inputPoolOutputAmount: Amount | null = null;
    try {
      switch (inputPoolInstruction) {
        case SwimDefiInstruction.Add: {
          if (outputPoolInputToken === null) {
            throw new Error("Invalid swap route");
          }
          const { lpOutputAmount } = inputPoolMath.add(
            exactInputAmounts.map((amount) =>
              amount.toHuman(EcosystemId.Solana),
            ),
          );
          inputPoolOutputAmount = Amount.fromHuman(
            outputPoolInputToken,
            lpOutputAmount,
          );
          break;
        }
        case SwimDefiInstruction.Swap: {
          if (inputPoolOutputTokenIndex === null) {
            throw new Error("Invalid swap route");
          }
          const { stableOutputAmount } = inputPoolMath.swapExactInput(
            exactInputAmounts.map((amount) =>
              amount.toHuman(EcosystemId.Solana),
            ),
            inputPoolOutputTokenIndex,
          );
          inputPoolOutputAmount = Amount.fromHuman(
            inputPoolTokens.tokens[inputPoolOutputTokenIndex],
            stableOutputAmount,
          );
          break;
        }
        default:
          throw new Error("Unknown swap route");
      }
    } catch {
      return null;
    }

    if (poolMaths.length === 1) {
      return inputPoolOutputAmount;
    }

    const outputPoolMath = poolMaths[1];
    const outputPoolOutputTokenIndex = outputPoolTokens.tokens.findIndex(
      ({ id }) => id === toToken.id,
    );
    try {
      switch (outputPoolInstruction) {
        case SwimDefiInstruction.RemoveExactBurn: {
          const { stableOutputAmount } = outputPoolMath.removeExactBurn(
            inputPoolOutputAmount.toHuman(EcosystemId.Solana),
            outputPoolOutputTokenIndex,
          );
          return Amount.fromHuman(toToken, stableOutputAmount);
        }
        case SwimDefiInstruction.Swap: {
          const { stableOutputAmount } = outputPoolMath.swapExactInput(
            outputPoolTokens.tokens.map((token) => {
              if (inputPoolOutputAmount === null) {
                throw new Error("Something went wrong");
              }
              const amount =
                token.id === inputPoolOutputAmount.tokenId
                  ? inputPoolOutputAmount
                  : Amount.zero(token);
              return amount.toHuman(EcosystemId.Solana);
            }),
            outputPoolOutputTokenIndex,
          );
          return Amount.fromHuman(toToken, stableOutputAmount);
        }
        default:
          throw new Error("Unknown swap route");
      }
    } catch {
      return null;
    }
  }, [
    exactInputAmounts,
    inputPoolTokens,
    outputPoolTokens,
    poolMaths,
    toToken,
  ]);
