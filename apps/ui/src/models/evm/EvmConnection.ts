import { BscscanProvider } from "@ethers-ancillary/bsc";
import { Env } from "@swim-io/core";
import { EvmEcosystemId } from "@swim-io/evm";
import { ERC20__factory } from "@swim-io/evm-contracts";
import { isNotNull } from "@swim-io/utils";
import Decimal from "decimal.js";
import { ethers } from "ethers";

import type { EvmSpec } from "../../config";
import { isEcosystemEnabled } from "../../config";

import { AuroraScanProvider, getAuroraScanNetwork } from "./AuroraScanProvider";
import { FtmScanProvider, getFtmScanNetwork } from "./FtmScanProvider";
import { LocalProvider } from "./LocalProvider";
import { MoralisProvider } from "./MoralisProvider";
import {
  getKaruraProvider,
  getKaruraSubQl,
  PolkadotProvider,
} from "./PolkadotProvider";
import {
  getPolygonScanNetwork,
  PolygonScanProvider,
} from "./PolygonScanProvider";
import { getSnowTraceNetwork, SnowTraceProvider } from "./SnowTraceProvider";

type EtherscanProvider = ethers.providers.EtherscanProvider;
type TransactionReceipt = ethers.providers.TransactionReceipt;
type TransactionResponse = ethers.providers.TransactionResponse;

export type Provider =
  | MoralisProvider
  | EtherscanProvider
  | LocalProvider
  | PolkadotProvider;

// TODO: Use proper endpoints via env
const BNB_MAINNET_RPC_URL = process.env.REACT_APP_BNB_MAINNET_RPC_URL;
const BNB_TESTNET_RPC_URL = process.env.REACT_APP_BNB_TESTNET_RPC_URL;

const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.REACT_APP_POLYGONSCAN_API_KEY;
const FTMSCAN_API_KEY = process.env.REACT_APP_FTMSCAN_API_KEY;
const AURORASCAN_API_KEY = process.env.REACT_APP_AURORASCAN_API_KEY;
const SNOWTRACE_API_KEY = process.env.REACT_APP_SNOWTRACE_API_KEY;

const MORALIS_ID = "Swim UI";

/**
 * Network names from:
 * https://github.com/ethers-io/ethers.js/blob/7b134bd5c9f07f60b2e38b110268042e10f68174/packages/providers/src.ts/alchemy-provider.ts#L57-L93
 */
const getEtherscanNetwork = (env: Env): ethers.providers.Networkish => {
  switch (env) {
    case Env.Mainnet:
      return "homestead";
    case Env.Devnet:
      return "goerli";
    default:
      throw new Error(`Etherscan does not support ${env}`);
  }
};

/**
 * Network names from:
 * https://github.com/ethers-io/ancillary-bsc/blob/559783304776d82da943fba2be43bfe99e93afc3/src.ts/bscscan-provider.ts#L15-L23
 */
const getBscscanNetwork = (env: Env): ethers.providers.Networkish => {
  switch (env) {
    case Env.Mainnet:
      return "bsc-mainnet";
    case Env.Devnet:
      return "bsc-testnet";
    default:
      throw new Error(`Bscscan does not support ${env}`);
  }
};

const getBnbRpcUrl = (env: Env): string => {
  switch (env) {
    case Env.Mainnet:
      if (BNB_MAINNET_RPC_URL === undefined) {
        throw new Error("BNB_MAINNET_RPC_URL is not set");
      }
      return BNB_MAINNET_RPC_URL;
    case Env.Devnet:
      if (BNB_TESTNET_RPC_URL === undefined) {
        throw new Error("BNB_TESTNET_RPC_URL is not set");
      }
      return BNB_TESTNET_RPC_URL;
    default:
      throw new Error(`${env} not supported by Moralis Provider`);
  }
};

export class EvmConnection {
  public provider: Provider;
  // eslint-disable-next-line functional/prefer-readonly-type
  private readonly txReceiptCache: Map<string, TransactionReceipt>;

  constructor(env: Env, chainSpec: EvmSpec) {
    this.provider = EvmConnection.getIndexerProvider(env, chainSpec);
    this.txReceiptCache = new Map();
  }

  public static getIndexerProvider(
    env: Env,
    { ecosystem, rpcUrls }: EvmSpec,
  ): Provider {
    if (!isEcosystemEnabled(ecosystem)) {
      return new LocalProvider(rpcUrls[0]);
    }
    switch (ecosystem) {
      case EvmEcosystemId.Acala:
        return new LocalProvider(rpcUrls[0]);
      case EvmEcosystemId.Aurora:
      case EvmEcosystemId.Fantom:
      case EvmEcosystemId.Bnb:
      case EvmEcosystemId.Avalanche:
      case EvmEcosystemId.Ethereum:
      case EvmEcosystemId.Polygon:
        switch (env) {
          case Env.Mainnet:
          case Env.Devnet:
            return EvmConnection.getPublicEvmIndexerProvider(env, ecosystem);
          default: {
            return new LocalProvider(rpcUrls[0]);
          }
        }
      case EvmEcosystemId.Karura:
        switch (env) {
          case Env.Mainnet:
            return EvmConnection.getPublicEvmIndexerProvider(env, ecosystem);
          case Env.Devnet:
          default: {
            return new LocalProvider(rpcUrls[0]);
          }
        }
    }
  }

  private static getPublicEvmIndexerProvider(
    env: Env,
    ecosystemId: EvmEcosystemId,
  ): Provider {
    switch (ecosystemId) {
      case EvmEcosystemId.Ethereum:
        return new ethers.providers.EtherscanProvider(
          getEtherscanNetwork(env),
          ETHERSCAN_API_KEY,
        );
      case EvmEcosystemId.Bnb:
        try {
          return new MoralisProvider(env, getBnbRpcUrl(env), MORALIS_ID);
        } catch (error) {
          // Fall back to basic Bscscan provider with no API key
          // This is useful eg for coding challenges
          if (process.env.NODE_ENV !== "development") {
            throw error;
          }
          return new BscscanProvider(getBscscanNetwork(env));
        }
      case EvmEcosystemId.Avalanche: {
        return new SnowTraceProvider(
          getSnowTraceNetwork(env),
          SNOWTRACE_API_KEY,
        );
      }
      case EvmEcosystemId.Polygon: {
        return new PolygonScanProvider(
          getPolygonScanNetwork(env),
          POLYGONSCAN_API_KEY,
        );
      }
      case EvmEcosystemId.Karura: {
        return new PolkadotProvider(
          getKaruraProvider(env),
          getKaruraSubQl(env),
        );
      }
      // TODO: Refactor repetitive code for PolygonScanProvider, SnowTraceProvider, FtmScanProvider, AuroraScanProvider
      // Provider classes are the same.
      // Differences are in `{X}Network`, `{X}Provider#constructor`, and URLs in `{X}Provider#getBaseUrl`
      // In EvmConnection, code is almost the same in `get{X}Network` functions and in switch-case in `getPublicEvmIndexerProvider`
      case EvmEcosystemId.Fantom: {
        return new FtmScanProvider(getFtmScanNetwork(env), FTMSCAN_API_KEY);
      }
      case EvmEcosystemId.Aurora: {
        return new AuroraScanProvider(
          getAuroraScanNetwork(env),
          AURORASCAN_API_KEY,
        );
      }
      default:
        throw new Error(`Unsupported EVM ecosystem: ${ecosystemId}`);
    }
  }

  public async getHistory(
    address: string,
  ): Promise<readonly TransactionResponse[] | null> {
    // NOTE: ethers does not use strict mode so we widen the type here
    const history = (await this.provider.getHistory(address)) as
      | readonly (TransactionResponse | null)[]
      | null;
    return history?.filter(isNotNull) ?? null;
  }

  public async getTxReceipt(
    txResponse: TransactionResponse | null,
  ): Promise<TransactionReceipt | null> {
    if (!txResponse) {
      return null;
    }

    const knownTx = this.txReceiptCache.get(txResponse.hash);
    if (knownTx !== undefined) {
      return knownTx;
    }

    // NOTE: The .wait method implements a lot of useful features like retries and exponential backoff.
    // So we prioritize it if available.
    if (typeof txResponse.wait === "function") {
      const maybeTxReceipt = (await txResponse.wait()) as
        | ethers.providers.TransactionReceipt
        | null
        | undefined;
      if (maybeTxReceipt) {
        this.txReceiptCache.set(txResponse.hash, maybeTxReceipt);
        return maybeTxReceipt;
      }
    }

    // NOTE: ethers does not use strict mode so we widen the type here
    // This seems to be more reliable than txResponse.wait()
    const maybeTxReceipt = (await this.provider.waitForTransaction(
      txResponse.hash,
      1,
    )) as ethers.providers.TransactionReceipt | null | undefined;
    if (maybeTxReceipt) {
      this.txReceiptCache.set(txResponse.hash, maybeTxReceipt);
      return maybeTxReceipt;
    }

    return null;
  }

  public async getTxReceiptOrThrow(
    txResponse: TransactionResponse,
  ): Promise<ethers.providers.TransactionReceipt> {
    const txReceipt = await this.getTxReceipt(txResponse);
    if (txReceipt === null) {
      throw new Error(`Transaction not found: ${txResponse.hash}`);
    }
    return txReceipt;
  }

  public async getEthBalance(walletAddress: string): Promise<Decimal> {
    try {
      const balanceInWei = await this.provider.getBalance(walletAddress);
      return new Decimal(ethers.utils.formatUnits(balanceInWei));
    } catch {
      return new Decimal(0);
    }
  }

  public async getErc20Balance(
    contractAddress: string,
    walletAddress: string,
  ): Promise<Decimal | null> {
    const erc20Contract = ERC20__factory.connect(
      contractAddress,
      this.provider,
    );
    try {
      const balance = await erc20Contract.balanceOf(walletAddress);
      return new Decimal(balance.toString());
    } catch {
      return null;
    }
  }
}
