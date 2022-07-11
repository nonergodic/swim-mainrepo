import type { ReadonlyRecord } from "../utils";

import type { EvmEcosystemId } from "./ecosystem";
import { EcosystemId, isEcosystemEnabled } from "./ecosystem";
import { Env } from "./env";

export interface BasePoolSpec {
  readonly id: string;
  readonly ecosystem: EcosystemId;
  readonly displayName: string;
  readonly isStakingPool: boolean;
  readonly isStableSwap: boolean;
  readonly isLegacyPool: boolean;
  readonly address: string; // canonical address which individuates the pool
  readonly feeDecimals: number;
  readonly lpToken: string; // token ID
  readonly tokens: readonly string[]; // token IDs
  readonly isDisabled?: boolean;
}

export interface SolanaPoolSpec extends BasePoolSpec {
  readonly ecosystem: EcosystemId.Solana;
  readonly contract: string; // the Swim program ID
  /**
   * Maps token IDs to addresses of token accounts owned by the pool
   */
  readonly tokenAccounts: ReadonlyMap<string, string>;
  readonly authority: string;
}

export interface EvmPoolSpec extends BasePoolSpec {
  readonly ecosystem: EvmEcosystemId;
}

export type PoolSpec = SolanaPoolSpec | EvmPoolSpec;

export const isPoolRestructureEnabled = (): boolean =>
  !!process.env.REACT_APP_ENABLE_POOL_RESTRUCTURE;

const MAINNET_POOLS: readonly PoolSpec[] = [
  {
    id: "hexapool",
    ecosystem: EcosystemId.Solana,
    displayName: "Stablecoin Hexa-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC",
    address: "8cUvGTFvSWx9WPebYYfDxwiJPdGx2EJUtpve6jP9SBma",
    authority: "AfhhYsLMXXyDxQ1B7tNqLTXXDHYtDxCzPcnXWXzHAvDb",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-hexapool",
    tokenAccounts: new Map([
      ["mainnet-solana-usdc", "5uBU2zUG8xTLA6XwwcTFWib1p7EjCBzWbiy44eVASTfV"],
      ["mainnet-solana-usdt", "Hv7yPYnGs6fpN3o1NZvkima9mKDrRDJtNxf23oKLCjau"],
      ["mainnet-ethereum-usdc", "4R6b4aibi46JzAnuA8ZWXrHAsR1oZBTZ8dqkuer3LsbS"],
      ["mainnet-ethereum-usdt", "2DMUL42YEb4g1HAKXhUxL3Yjfgoj4VvRqKwheorfFcPV"],
      ["mainnet-bnb-busd", "DukQAFyxR41nbbq2FBUDMyrtF2CRmWBREjZaTVj4u9As"],
      ["mainnet-bnb-usdt", "9KMH3p8cUocvQRbJfKRAStKG52xCCWNmEPsJm5gc8fzw"],
    ]),
    tokens: [
      "mainnet-solana-usdc",
      "mainnet-solana-usdt",
      "mainnet-ethereum-usdc",
      "mainnet-ethereum-usdt",
      "mainnet-bnb-busd",
      "mainnet-bnb-usdt",
    ],
  },
  {
    id: "meta-avalanche-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Avalanche USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "AzJnv1DX2tNWZyQVeoAG71CoaSusr8q1qLPVxJEW4xMP",
    authority: "Ha7YEA5wRWyH2htfyMXw3VfLbtBHm4UoVXMpq8Ev6zJh",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-avalanche-usdc",
    tokenAccounts: new Map([
      [
        "mainnet-avalanche-usdc",
        "9RgAUVyd72THEnLLwZswBbc2VpmJnSPP9R91ZVxjq1rv",
      ],
      [
        "mainnet-solana-lp-hexapool",
        "6zbeCeeUGbjiiW9PpxVuMqLmWZowoaDsMmWtRmX5Nx5W",
      ],
    ]),
    tokens: ["mainnet-avalanche-usdc", "mainnet-solana-lp-hexapool"],
  },
  {
    id: "meta-avalanche-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Avalanche USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "2zG5Lk5GcoGWqarZjuQm2YtJ9sq9nCS5qPaddkmLJAxG",
    authority: "EpvBni7vTfbTG95zf9sNcS9To1NEKnVMpCwZdb21tKsg",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-avalanche-usdt",
    tokenAccounts: new Map([
      [
        "mainnet-avalanche-usdt",
        "52q1M9ceJozzfGTgD5wx6K2WQjvQnUpF3uKmWzdy73ER",
      ],
      [
        "mainnet-solana-lp-hexapool",
        "9QAFkr2tYntkeiWFS6KJYYBFLeKh6CBTqUwhCCBdhdbV",
      ],
    ]),
    tokens: ["mainnet-avalanche-usdt", "mainnet-solana-lp-hexapool"],
  },
  {
    id: "meta-polygon-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Polygon USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "FRarK7GGuMBihxsu4F9wQPEemjLQ6xhATASSWfsZsAXX",
    authority: "2iLTifF3JDP65AjFKZ3t4mgfJdQVSmVCiM8Zca3TgvpU",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-polygon-usdc",
    tokenAccounts: new Map([
      ["mainnet-polygon-usdc", "DwjutE8CB1WNUzy78f44BdJNWMF1pYC5wd6eTchRcacL"],
      [
        "mainnet-solana-lp-hexapool",
        "9MQ6FFBm7Nk9jMY65m8MYvsno2akEGPLMLjargoccvic",
      ],
    ]),
    tokens: ["mainnet-polygon-usdc", "mainnet-solana-lp-hexapool"],
  },
  {
    id: "meta-polygon-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Polygon USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "7mCixtML8ApfdRQYBC77c2PGP55Lj1XGpmFVZ2CShaMq",
    authority: "3uxBU3fRZzp3V7v9MTNZiDmjxDkKh3rZutLwFtnjJ2pQ",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-polygon-usdt",
    tokenAccounts: new Map([
      ["mainnet-polygon-usdt", "A4KTWbPgxUeLWJdXyqsc7tV2GgkxW5gaKeHvKz3LLght"],
      [
        "mainnet-solana-lp-hexapool",
        "BBHCpu6xKDjvoUDTBmBmejAoN4ADNeZiYcvKfVv7yz3L",
      ],
    ]),
    tokens: ["mainnet-polygon-usdt", "mainnet-solana-lp-hexapool"],
  },
  {
    id: "gst-solana-bnb",
    ecosystem: EcosystemId.Solana,
    displayName: "GST SPL - GST BEP20",
    isStakingPool: false,
    isStableSwap: false,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "FRvGoXtVe5QLfBbodeaUxjzr6aqbwpSECDDV57SG5Tmf",
    authority: "57k3vNmCivSYn7EwQNjcNFcCWAdohZ9xACfMhJGwKiBq",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-gst",
    tokenAccounts: new Map([
      ["mainnet-bnb-gst", "APG2hZqzk54NVjscBZ13iEZ9StR4Jpv82767hpHJwFQ7"],
      ["mainnet-solana-gst", "Hv4t3QZhbb2enUYmXm2X2pRCJ4jsVNb8pRhLDqs6oHNZ"],
    ]),
    tokens: ["mainnet-bnb-gst", "mainnet-solana-gst"],
  },
  {
    id: "gmt-solana-bnb",
    ecosystem: EcosystemId.Solana,
    displayName: "GMT SPL - GMT BEP20",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "4Np8YkTg6wobPXPEG5GagdZUpZt863RqXs8TNcMcqxTR",
    authority: "HZr3bF8YEJWMV75Wi3aFEHEyLLk61VyQduXtunWtXNVQ",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-gmt",
    tokenAccounts: new Map([
      ["mainnet-bnb-gmt", "kCKv3PwjiopEDGjtztH3rbJvDvKiNGRk26iuSE1SDF1"],
      ["mainnet-solana-gmt", "2jakYHDLzK14LvGfQ6XMevkdXjmR2pptMxD6HLsDUDvx"],
    ]),
    tokens: ["mainnet-bnb-gmt", "mainnet-solana-gmt"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_AURORA_USDC,
    id: "meta-aurora-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "3w7ryrn4fJcc4dHoYSo8VNdysFRB93PVwT8L6YK2SQuw",
    authority: "DqTF8aZu63iHF55tBz1ePuaBKJ3F2srNVha3B4PpCT4N",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-aurora-usdc",
    tokenAccounts: new Map([
      ["mainnet-aurora-usdc", "5fJA79DSwdncsLfH31Awgzk8P1EmTRXfQJzQfRVJ6MsH"],
      [
        "mainnet-solana-lp-hexapool",
        "H7DP6XBwU7N6mWavF3qiqvuoSD3z6T3dtjGEmqkYy8mX",
      ],
    ]),
    tokens: ["mainnet-aurora-usdc", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_AURORA_USDT,
    id: "meta-aurora-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "4t1cfAbmLjyLuBo1gsvCVKjVUR48ixqvS4dLKW8dtRvm",
    authority: "23CU3bqMJoRTpvyti84CmPbkAyNJDnTZE7DYj6MnhGdK",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-aurora-usdt",
    tokenAccounts: new Map([
      ["mainnet-aurora-usdt", "6VtNuUZR1CxBunrQBoNtjC2ZZWqhpmkWwdY8zhbFBcie"],
      [
        "mainnet-solana-lp-hexapool",
        "CpMPTJ72mqeVRK6569sGqkWCV5B6dSZpTCD7BAKW2QPo",
      ],
    ]),
    tokens: ["mainnet-aurora-usdt", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_AURORA_USN,
    id: "meta-aurora-usn",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USN Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "4Cos4Z3DaMa37MpvjfCEH93DqonPmDV3b6GuPvmWugqF",
    authority: "9dowtd9EbAtC9iKyXWaC5TBmHTivDfdQ6JbeTvHiCK6p",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-aurora-usn",
    tokenAccounts: new Map([
      ["mainnet-aurora-usn", "3dkbc5KuJSJ9ah87uVZRRLZMH1JKMaREQgcAkHSijWpR"],
      [
        "mainnet-solana-lp-hexapool",
        "9Ddfhn9P1BJvxtfCvgvKBfSiKSrwdDBBSUf9SdQkDDW5",
      ],
    ]),
    tokens: ["mainnet-aurora-usn", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !isEcosystemEnabled(EcosystemId.Fantom),
    id: "meta-fantom-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Fantom USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "GCbJStx8XY767Bnj6jj4hzeRJBpfDvrrZS8at3PbABu9",
    authority: "H7BkMwbJfLiWE9sSDATHTqXykm1xBjeRzzLDatW2QdEt",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-fantom-usdc",
    tokenAccounts: new Map([
      ["mainnet-fantom-usdc", "AHnZRtLz5J17F1X7Z8LJCk2yGxSpii1uMMyPrBEpPdgg"],
      [
        "mainnet-solana-lp-hexapool",
        "E7mgPEb7T7Q7RPUQpZ4XLJZPYiVhj41jyLVc8P3EGfWN",
      ],
    ]),
    tokens: ["mainnet-fantom-usdc", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_KARURA_AUSD,
    id: "meta-karura-ausd",
    ecosystem: EcosystemId.Solana,
    displayName: "Karura AUSD Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "GRBTi98rcqseFNGdBscPMMWFGBeadZsaN69Tya1dKDJi",
    authority: "5frFvM55BNXZfdhCL7iqm6DnYBiUijDQSWiNDyV8gAYL",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-karura-ausd",
    tokenAccounts: new Map([
      ["mainnet-karura-ausd", "4ddm9KiJJsj2q8tdwz9GR9UgQkQsMMtVuoHn9bqR5BTe"],
      [
        "mainnet-solana-lp-hexapool",
        "5Z1ekWcEWukuaWWELfBVDs7xtnX7KZLRDQv6AttMMQaL",
      ],
    ]),
    tokens: ["mainnet-karura-ausd", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_KARURA_USDT,
    id: "meta-karura-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Karura USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "DoRzxEVDJK1pN3gdGmjUHkYrS2A4Qkkf3U4ceaowxvDB",
    authority: "4XQz1qHMMTkFETn5PSNyLVutYPyZ4han8RB8Mmw1G48Q",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-karura-usdt",
    tokenAccounts: new Map([
      ["mainnet-karura-usdt", "H367XXfQLYpLPg39EitoWKtRTBjPD32nqNUinjaepxcg"],
      [
        "mainnet-solana-lp-hexapool",
        "2HGg2jRpy7Z11cbsVJfTmrqpmk5FSrfX7NDrH2oTqmVr",
      ],
    ]),
    tokens: ["mainnet-karura-usdt", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !isEcosystemEnabled(EcosystemId.Acala),
    id: "meta-acala-ausd",
    ecosystem: EcosystemId.Solana,
    displayName: "Acala AUSD Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "11111111111111111111111111111111", // TODO: Update
    authority: "11111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-meta-acala-ausd",
    tokenAccounts: new Map([
      ["mainnet-acala-ausd", "11111111111111111111111111111111"], // TODO: Update
      ["mainnet-solana-lp-hexapool", "11111111111111111111111111111111"], // TODO: Update
    ]),
    tokens: ["mainnet-acala-ausd", "mainnet-solana-lp-hexapool"],
  },
  {
    isDisabled: true,
    id: "swimlake",
    ecosystem: EcosystemId.Solana,
    displayName: "SwimLake",
    isStakingPool: true,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "sWimoyG4uZiuHwVBp6ZCirB3cdqsHuoxDgs46X9jWMy",
    address: "4iV8F4KSgcSdDcMzGS6cR7X9XU6bzvz4o7xMkfMPeAmc",
    authority: "BVX7M8ZHW9RK3fasWbByfJZ6CdjrnDUMe5kLANxoMVfA",
    feeDecimals: 6,
    lpToken: "mainnet-solana-lp-swimlake",
    tokenAccounts: new Map([
      ["mainnet-solana-swim", "swimnKEr963p7EbCjsSnBCoYwytuZHPm3zbq6fKLHXb"],
    ]),
    tokens: ["mainnet-solana-swim"],
  },
].filter((spec) => !spec.isDisabled);

export const DEVNET_POOLS_FOR_RESTRUCTURE: readonly PoolSpec[] = [
  {
    id: "devnet-solana-usdc-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Solana USDC USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    contract: "1111111111111111111111111111111111111111111", // TODO: Update
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    authority: "11111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-swimusd",
    tokenAccounts: new Map([
      ["devnet-solana-usdc", "11111111111111111111111111111111111111111111"], // TODO: Update
      ["devnet-solana-usdt", "11111111111111111111111111111111111111111111"], // TODO: Update
    ]),
    tokens: ["devnet-solana-usdc", "devnet-solana-usdt"],
  },
  {
    id: "devnet-ethereum-usdc-usdt",
    ecosystem: EcosystemId.Ethereum,
    displayName: "Ethereum USDC USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-ethereum-lp-primary",
    tokens: ["devnet-swimusd", "devnet-ethereum-usdc", "devnet-ethereum-usdt"],
  },
  {
    id: "devnet-bnb-busd-usdt",
    ecosystem: EcosystemId.Bnb,
    displayName: "BNB BUSD USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-bnb-lp-primary",
    tokens: ["devnet-swimusd", "devnet-bnb-busd", "devnet-bnb-usdt"],
  },
  {
    id: "devnet-avalanche-usdc-usdt",
    ecosystem: EcosystemId.Avalanche,
    displayName: "Avalanche USDC USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-avalanche-lp-primary",
    tokens: [
      "devnet-swimusd",
      "devnet-avalanche-usdc",
      "devnet-avalanche-usdt",
    ],
  },
  {
    id: "devnet-polygon-usdc-usdt",
    ecosystem: EcosystemId.Polygon,
    displayName: "Polygon USDC USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-polygon-lp-primary",
    tokens: ["devnet-swimusd", "devnet-polygon-usdc", "devnet-polygon-usdt"],
  },
  {
    id: "devnet-aurora-usdc-usdt",
    ecosystem: EcosystemId.Aurora,
    displayName: "Aurora USDC USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-aurora-lp-primary",
    tokens: ["devnet-swimusd", "devnet-aurora-usdc", "devnet-aurora-usdt"],
  },
  {
    id: "devnet-aurora-usn",
    ecosystem: EcosystemId.Aurora,
    displayName: "Aurora USN",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-aurora-lp-meta-usn",
    tokens: ["devnet-swimusd", "devnet-aurora-usn"],
  },
  {
    id: "devnet-fantom-usdc",
    ecosystem: EcosystemId.Fantom,
    displayName: "Fantom USDC",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-fantom-lp-primary",
    tokens: ["devnet-swimusd", "devnet-fantom-usdc"],
  },
  {
    id: "devnet-karura-usdt",
    ecosystem: EcosystemId.Karura,
    displayName: "Karura USDT",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-karura-lp-primary",
    tokens: ["devnet-swimusd", "devnet-karura-usdt"],
  },
  {
    id: "devnet-karura-ausd",
    ecosystem: EcosystemId.Karura,
    displayName: "Karura aUSD",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-karura-lp-meta-ausd",
    tokens: ["devnet-swimusd", "devnet-karura-ausd"],
  },
  {
    id: "devnet-meta-acala-ausd",
    ecosystem: EcosystemId.Acala,
    displayName: "Aurora aUSD",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: false,
    address: "1111111111111111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-acala-lp-meta-ausd",
    tokens: ["devnet-swimusd", "devnet-acala-ausd"],
  },
];

export const DEVNET_POOLS: readonly PoolSpec[] = [
  {
    id: "hexapool",
    ecosystem: EcosystemId.Solana,
    displayName: "Stablecoin Hexa-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWiMDJYFUGj6cPrQ6QYYYWZtvXQdRChSVAygDZDsCHC",
    address: "G4dYhqGrGwmx78ad8LXbGHRUfacRkmxycw3XJDWPW7Ec",
    authority: "B3rnh8XJq3F7sJDLu7Kr9z24KXxkHsvLmZB29FcVqe5A",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-hexapool",
    tokenAccounts: new Map([
      ["devnet-ethereum-usdc", "EqhKYj5VQ8C3c4RWrfnm1UdoFPQoKYTWJdRWnSpN73sz"],
      ["devnet-ethereum-usdt", "DR2pkTqM3bYHtcN6YDW4k9tnCDYbtrbwE61yzRMQn7h"],
      ["devnet-bnb-busd", "24kq1sAEyYgoT2H6SZEMQ8eqanyt7mDDhEQ1pLEhXCch"],
      ["devnet-bnb-usdt", "63voUkHQrDfULcCKXwU6i9MoENhjVyMWXgxCxnnaKx37"],
      ["devnet-solana-usdc", "66MCny16VUbuecNtvqXsLjdBSqVigeb31P14dtayH2jq"],
      ["devnet-solana-usdt", "4ZtpwjuxYC9VZBGAphBVpUVQzdy4anxF2ctJDp9xkpYA"],
    ]),
    tokens: [
      "devnet-ethereum-usdc",
      "devnet-ethereum-usdt",
      "devnet-bnb-busd",
      "devnet-bnb-usdt",
      "devnet-solana-usdc",
      "devnet-solana-usdt",
    ],
  },
  {
    id: "meta-avalanche-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Avalanche USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "212ehpMyQZPfD5cNtZMxzwTmQHkDoFhZjT4UyBCzAxFU",
    authority: "3cvyGruDFQ3uyxGPNHXLEQyZe3rLPiLsjvNkvSFTTURg",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-avalanche-usdc",
    tokenAccounts: new Map([
      ["devnet-avalanche-usdc", "4wVFKRTNK5RriQaRfMBm6BjRdnb5yqUFKmthQXmkCgho"],
      [
        "devnet-solana-lp-hexapool",
        "14j3ek3AD7UHgQYpvvRM8265Vh4SdXsvxNLyhgYuRTtb",
      ],
    ]),
    tokens: ["devnet-avalanche-usdc", "devnet-solana-lp-hexapool"],
  },
  {
    id: "meta-avalanche-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Avalanche USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "De2SEaTh5cAx6h6zSySdqbbHjVVhouoUyFscLp1vaUcp",
    authority: "DAP8h8zeYURm6FFvhnQ9pcNdwCSS2gsF3GmdcDeSeBx5",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-avalanche-usdt",
    tokenAccounts: new Map([
      ["devnet-avalanche-usdt", "Eda3mSE2nX2ynoFZxCorGgDfp24i5zPfCvcEhks9yN5d"],
      [
        "devnet-solana-lp-hexapool",
        "HHUt836dTXR8kxUGZUiK7sin6cxkf3U98YW2FYivKBcJ",
      ],
    ]),
    tokens: ["devnet-avalanche-usdt", "devnet-solana-lp-hexapool"],
  },
  {
    id: "meta-polygon-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Polygon USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "FgurBCdyw9XhwXGUYR6qaT8eTXCMWDt3b58WW1FtVppa",
    authority: "69coJLCxruUbth3iNtzbwXcgyojKjKAVAFiTic49Fbgj",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-polygon-usdc",
    tokenAccounts: new Map([
      ["devnet-polygon-usdc", "7nLzo7TFJf41WBab5AuLCuAF7A9TRcvEQCPrzTjrnhG8"],
      [
        "devnet-solana-lp-hexapool",
        "8Bob5k8JvcuwhDkSeUT91BMM8JU2z36bdXeZR17aNaRo",
      ],
    ]),
    tokens: ["devnet-polygon-usdc", "devnet-solana-lp-hexapool"],
  },
  {
    id: "meta-polygon-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Polygon USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "7Epgp6xrmSsLFWXxwYwsmxYXz2mLxRT6bLvK4rYvrbTc",
    authority: "8cMYB4rFYMu5vm4Q9GM7ZskDkJ7anzdA4ETxcyua94K3",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-polygon-usdt",
    tokenAccounts: new Map([
      ["devnet-polygon-usdt", "G9fLWPVm5hNJ8yWhUd3uBPB1FYmK2MNqVPBT2qY4iqK7"],
      [
        "devnet-solana-lp-hexapool",
        "9McdiBTpZV7nYYa4Tv7411wetRxTakVb8XjzAFNohN9Y",
      ],
    ]),
    tokens: ["devnet-polygon-usdt", "devnet-solana-lp-hexapool"],
  },
  {
    id: "gst-solana-bnb",
    ecosystem: EcosystemId.Solana,
    displayName: "GST SPL - GST BEP20",
    isStakingPool: false,
    isStableSwap: false,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "DLg2DinrAnCjC5zxaoRzJHModVpEDNdnNVLE7VxPhfxe",
    authority: "AyQbRcdNn6khTJDqg1vEwb6jWQAVKcEbm4XmbFLW3k8",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-gst",
    tokenAccounts: new Map([
      ["devnet-bnb-gst", "D7YxhU2Q1qUJEVGfnvaU45mfkQJ5E5eurrMHGShYKciX"],
      ["devnet-solana-gst", "BpbTS7jLsiTiDjdNwAVxju8NmYgMwCacJKCLRnioLGxV"],
    ]),
    tokens: ["devnet-bnb-gst", "devnet-solana-gst"],
  },
  {
    id: "gmt-solana-bnb",
    ecosystem: EcosystemId.Solana,
    displayName: "GMT SPL - GMT BEP20",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "GZCwq7KwkoQjrUkVhpTkpLR3Epv4Vtn4j4FcuJUnhmhG",
    authority: "DvSxr48zvgGtCPEePzBz6R1eKo7xz1gkaE3YhqJm1JHV",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-gmt",
    tokenAccounts: new Map([
      ["devnet-bnb-gmt", "7WbJaS6tEXCxMqtiWJ7P7GkHLadskUJ2UzJJVv2qC3aP"],
      ["devnet-solana-gmt", "6gG1cPnypyNVN16cCHfbZoJ4GMXREvbxPTEQXakcZQiJ"],
    ]),
    tokens: ["devnet-bnb-gmt", "devnet-solana-gmt"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_AURORA_USDC,
    id: "meta-aurora-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "EzpaZeECVuVKh4dEZsdxqi2qtLiRN7Jm25Km4Cvqu2XE",
    authority: "BcQ67jPVrPTbZZ4xbgbDYkZynGcg1jUU198f1SzpuPcw",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-aurora-usdc",
    tokenAccounts: new Map([
      ["devnet-aurora-usdc", "yZABYQoCEgNCfktMaxgt3VfyKVK1WRi4A9BjkgnetPt"],
      [
        "devnet-solana-lp-hexapool",
        "EWs9XLKHEq4rDaWcfmA2W51jqTjLjR3PBXNJpcTGt64v",
      ],
    ]),
    tokens: ["devnet-aurora-usdc", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_AURORA_USDT,
    id: "meta-aurora-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "t6JAmJWDi4y6pp32p268ru3GrHEBXdoHERVqSjek3XY",
    authority: "ETywNpF1gsXmmPLSavw563Mr4FaCLmVxcupdWxPZ8nxw",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-aurora-usdt",
    tokenAccounts: new Map([
      ["devnet-aurora-usdt", "DpBhN9UoHh4RGGHcoGBfqeqKndstiTXup6pwhcBxXFFA"],
      [
        "devnet-solana-lp-hexapool",
        "Gmd1KvrLonD6pzeMz2U1nTJVgG4yv9LySpYQZVLV8eBm",
      ],
    ]),
    tokens: ["devnet-aurora-usdt", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: true, // TODO: Enable when deployed on devnet
    id: "meta-aurora-usn",
    ecosystem: EcosystemId.Solana,
    displayName: "Aurora USN Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "11111111111111111111111111111111", // TODO: Update
    authority: "11111111111111111111111111111111", // TODO: Update
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-aurora-usn",
    tokenAccounts: new Map([
      ["devnet-aurora-usn", "11111111111111111111111111111111"], // TODO: Update
      ["devnet-solana-lp-hexapool", "11111111111111111111111111111111"], // TODO: Update
    ]),
    tokens: ["devnet-aurora-usn", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !isEcosystemEnabled(EcosystemId.Fantom),
    id: "meta-fantom-usdc",
    ecosystem: EcosystemId.Solana,
    displayName: "Fantom USDC Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "8EqXgUstAwEihJLcmeW8ojrSgbRbc2sWshnKpvDPKLiC",
    authority: "9RUzzifoTRPuJKSRzhNR92kDT7F3vT8Di57hDFdtU3Pu",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-fantom-usdc",
    tokenAccounts: new Map([
      ["devnet-fantom-usdc", "3DExDt8nzBWdHZTy9eNp6RPfSPD9MKpUnpPLcMGRbKPX"],
      [
        "devnet-solana-lp-hexapool",
        "EHbgKe7U33hh8CQpLUkNiZv6aGdvXosein74XN66h4Dt",
      ],
    ]),
    tokens: ["devnet-fantom-usdc", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_KARURA_AUSD,
    id: "meta-karura-ausd",
    ecosystem: EcosystemId.Solana,
    displayName: "Karura AUSD Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "6ukUmzs2ZPokRXi8y3zbs3YvifcYZ6aZTmm3bpresupa",
    authority: "Gzgrhx5Z4DRL1daGcEXNzXw7LpMHUiVqEQG1jzoJ8GYE",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-karura-ausd",
    tokenAccounts: new Map([
      ["devnet-karura-ausd", "GMtr1h6yK3nFXUma2gW1tcf6wRoTg6dD4cRMWQRNiBcr"],
      [
        "devnet-solana-lp-hexapool",
        "t5Ze1g8r62wb3rhWxBuyw5t4ZFCE9815TW2kqbLBdGE",
      ],
    ]),
    tokens: ["devnet-karura-ausd", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !process.env.REACT_APP_ENABLE_KARURA_USDT,
    id: "meta-karura-usdt",
    ecosystem: EcosystemId.Solana,
    displayName: "Karura USDT Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "ELfBAsjAJbXoL6jmHNAK48ibrc85Z1DkzSg3WXEhgvxD",
    authority: "7NJJJt51JDXcKztQm24cvTHjBARz4PcmsFjdwXzy72nu",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-karura-usdt",
    tokenAccounts: new Map([
      ["devnet-karura-usdt", "83qeqo4SrVHGCzWny8m2bdHaMsGnv7te3mCSvueGzXJY"],
      [
        "devnet-solana-lp-hexapool",
        "Er4xHMADfjrjfDk798BoQNRBn4UrSTe93QK4Mx5mRHW4",
      ],
    ]),
    tokens: ["devnet-karura-usdt", "devnet-solana-lp-hexapool"],
  },
  {
    isDisabled: !isEcosystemEnabled(EcosystemId.Acala),
    id: "meta-acala-ausd",
    ecosystem: EcosystemId.Solana,
    displayName: "Acala AUSD Meta-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SWimmSE5hgWsEruwPBLBVAFi3KyVfe8URU2pb4w7GZs",
    address: "EU5P8s2UtDoAf32n5RLJTh7GXmdENy1WaeMbpxvPd4AH",
    authority: "3oKJcatorM1V9KeTKwasMC3NaAAzwbTfGaizpDKgeYGn",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-meta-acala-ausd",
    tokenAccounts: new Map([
      ["devnet-acala-ausd", "Cki7zNJ8jLbwN7UeCwZTsuHVxRd8m3Y5fz4f5ioBNGFW"],
      [
        "devnet-solana-lp-hexapool",
        "CmbqCiQSJw2mN6pTMG5vUsX3MHiBVMj2bGo59JRsoojH",
      ],
    ]),
    tokens: ["devnet-acala-ausd", "devnet-solana-lp-hexapool"],
  },
  {
    id: "swimlake",
    ecosystem: EcosystemId.Solana,
    displayName: "SwimLake",
    isStakingPool: true,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "sWimoyG4uZiuHwVBp6ZCirB3cdqsHuoxDgs46X9jWMy",
    address: "7BZQBVZrneaEKkBTExncHm7p6NuF5MMiDmBNTot2CQc5",
    authority: "69PatS67furtMJVwUBqHoFdrn5nDTtxCGSSqEu2anSYX",
    feeDecimals: 6,
    lpToken: "devnet-solana-lp-swimlake",
    tokenAccounts: new Map([
      ["devnet-solana-swim", "GBjDaDLHQHDZ25gTygyLCaobgSXbTZ3WR9TVNoDqaicm"],
    ]),
    tokens: ["devnet-solana-swim"],
  },
].filter((spec) => !spec.isDisabled);

const LOCALNET_POOLS: readonly PoolSpec[] = [
  {
    id: "hexapool",
    ecosystem: EcosystemId.Solana,
    displayName: "Stablecoin Hexa-Pool",
    isStakingPool: false,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "SwmGeiqX8avCodG8Bq7mbd4o5iMMfgGXoMAeECe5rmi",
    address: "PLSVJHkSe1wQgocGJx9d7KnfjXsPykq7cgLFHwXFRxV",
    authority: "3yRFKgKqAQBX3LaC5soLLsywua5FS7JCCWaJ5LQpnE2v",
    feeDecimals: 6,
    lpToken: "localnet-solana-lp-hexapool",
    tokenAccounts: new Map([
      ["localnet-solana-usdc", "TP19UrkLUihiEg3y98VjM8Gmh7GjWayucsbpyo195wC"],
      ["localnet-solana-usdt", "TP2gzosaKJNf5UjM8eWKKnN7Yni1uLbYJr88rvEvgPA"],
      ["localnet-ethereum-usdc", "TP3feUviS5XoqEpzz2d9iHhYip1wFaP7Zf4gmEXRVZ7"],
      ["localnet-ethereum-usdt", "TP4VVUhiHKBxzT6N3ThsivkHZtNtJTyx9HzYwLherjQ"],
      ["localnet-bnb-busd", "TP5Zu7nEzkif6zyz5pQaC3G9aPJ1PFSTfpvhQfDC2yr"],
      ["localnet-bnb-usdt", "TP6DaXSavPoCHKrKb5dcwtAkxM9b4Dwh4isd7fQ8hCb"],
    ]),
    tokens: [
      "localnet-solana-usdc",
      "localnet-solana-usdt",
      "localnet-ethereum-usdc",
      "localnet-ethereum-usdt",
      "localnet-bnb-busd",
      "localnet-bnb-usdt",
    ],
  },
  {
    id: "swimlake",
    ecosystem: EcosystemId.Solana,
    displayName: "SwimLake",
    isStakingPool: true,
    isStableSwap: true,
    isLegacyPool: true,
    contract: "Sw1LeM87T6PEh3ydfc7PqRN3PG1RCFBGthUPSsPa3p5",
    address: "PLSupkMugKscXq7cGMEqKMVU66YdPaAH8AHohCNHasE",
    authority: "2VpHusCv5wWgcPLMreRqgCxSHpcdftgkjycsPVN5k2wg",
    feeDecimals: 6,
    lpToken: "localnet-solana-lp-swimlake",
    tokenAccounts: new Map([
      ["localnet-solana-swim", "TP8n5tqhUXVE3uGeKMT8tDMY5BJ8aNmbzuzFNCJqjLE"],
    ]),
    tokens: ["localnet-solana-swim"],
  },
];

export const POOLS: ReadonlyRecord<Env, readonly PoolSpec[]> = {
  [Env.Mainnet]: MAINNET_POOLS,
  [Env.Devnet]: isPoolRestructureEnabled()
    ? [...DEVNET_POOLS, ...DEVNET_POOLS_FOR_RESTRUCTURE]
    : DEVNET_POOLS,
  [Env.Localnet]: LOCALNET_POOLS,
  [Env.CustomLocalnet]: LOCALNET_POOLS,
};
