import * as dotenv from "dotenv";

import { task } from "hardhat/config";
import { HardhatUserConfig, HttpNetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { getContractAddress } from "@ethersproject/address";

dotenv.config();
const { FACTORY_MNEMONIC, MNEMONIC, BSCSCAN_API_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const named = await hre.getNamedAccounts();

  for (const [name, address] of Object.entries(named)) {
    console.log(name, address);
  }

  const unnamed = await hre.getUnnamedAccounts();
  for (const address of unnamed) {
    console.log(address);
  }
});

task(
  "factoryAddress",
  "Prints the address the SwimFactory will be deployed to given a deployer address",
  async (_, { ethers }) => {
    if (typeof FACTORY_MNEMONIC === "undefined") {
      console.log("Factory Mnemonic not set in environment");
      return;
    }
    const wallet = ethers.Wallet.fromMnemonic(FACTORY_MNEMONIC);
    console.log(getContractAddress({ from: wallet.address, nonce: 0 }));
  }
);

//TODO doesn't work, how to deploy the factory and only the factory so I can call it's determine* functions?
// task("logicAddress", "Prints the address a logic contract will be deployed to given a its salt",
//   async ({logicContract, salt}, hre) => {
//     hre.run("deploy", {tags: ["FactoryFromPresigned"]});
//     const { getArtifact, read } = hre.deployments;
//     const logicDeployedBytecode = await (await getArtifact(logicContract)).deployedBytecode;
//     console.log(await read("SwimFactory", "determineLogicAddress", logicDeployedBytecode, salt));
//   },
// ).addParam("logic", "name of the artifact/contract").addParam("salt");
// task("proxyAddress", "Prints the address a proxy contract will be deployed to given its salt",
//   async ({salt}, hre) => {
//     hre.run("deploy", {tags: ["FactoryFromPresigned"]});
//     const { read } = hre.deployments;
//     console.log(await read("SwimFactory", "determineLogicAddress", salt));
//   },
// ).addParam("salt", "salt passed to the create2 call in SwimFactory");

task("presign", "Generates and prints a Deterministic Factory tx", async (_, hre) => {
  const { deployer } = await hre.getNamedAccounts();
  const { ethers } = hre;
  await hre.run("compile");
  const deployData = (await ethers.getContractFactory("SwimFactory")).getDeployTransaction(
    deployer
  );
  const deployTx = {
    ...deployData,
    to: undefined,
    nonce: 0,
    gasLimit: ethers.BigNumber.from("2000000"),
    chainId: 31337,
    gasPrice: ethers.BigNumber.from("1875000000"), //TODO
  };
  if (typeof FACTORY_MNEMONIC === "undefined") {
    console.log("Factory Mnemonic not set in environment");
    return;
  }
  const wallet = ethers.Wallet.fromMnemonic(FACTORY_MNEMONIC);
  const signedTx = await wallet.signTransaction(deployTx);
  console.log(signedTx);
});

const sharedNetworkConfig: HttpNetworkUserConfig = {};

sharedNetworkConfig.accounts = {
  mnemonic: MNEMONIC!,
};

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000, // Optimize heavily for runtime gas cost rather than deployment gas cost
      },
      outputSelection: {
        "*": {
          "*": [
            "metadata",
            "evm.bytecode",
            "evm.bytecode.sourceMap",
            "ir",
            // "irOptimized",
            "evm.assembly",
          ],
          // "": ["ast"],
        },
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      deploy: ["./deploy/hardhat/"],
      loggingEnabled: false, //true,
      autoImpersonate: true,
      allowUnlimitedContractSize: true,
      gasPrice: 20000000000,
      gas: 60000000000,
      chainId: 31337,
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
    },
    localhost: {
      url: "http://127.0.0.1:8545/", // yarn hardhat node -> spins node on local network as ganache
      // accounts: No need for this, generated by Hardhat!
      chainId: 31337,
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      ...sharedNetworkConfig,
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      chainId: 4,
      saveDeployments: true,
      ...sharedNetworkConfig,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      chainId: 5,
      ...sharedNetworkConfig,
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: "https://mainnet.infura.io/v3/KEY",
      accounts: {
        mnemonic: MNEMONIC,
      },
      saveDeployments: true,
      chainId: 1,
    },
    mumbai: {
      ...sharedNetworkConfig,
      url: `https://polygon-mumbai.infura.io/v3/${"KEY"}`,
    },
    polygon: {
      ...sharedNetworkConfig,
      url: `https://polygon-mainnet.infura.io/v3/${"KEY"}`,
      chainId: 137,
    },
    bnbTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      ...sharedNetworkConfig,
    },
    bnbMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      ...sharedNetworkConfig,
    },
    fantomTestnet: {
      ...sharedNetworkConfig,
      url: `https://rpc.testnet.fantom.network/`,
    },
    avalancheFujiTestnet: {
      ...sharedNetworkConfig,
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
    },
    avalancheLocalhost: {
      url: "https://localhost:9650/ext/bc/C/rpc",
      chainId: 43112,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    currency: "USD",
  },
  etherscan: {
    apiKey: BSCSCAN_API_KEY,
    // apiKey: AVAXSCAN_APY_KEY,
    // apiKey: ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    governance: {
      default: 1,
    },
    governanceFeeRecipient: {
      default: 2,
    },
    testLiquidityProvider: {
      default: 10,
    },
    testUser: {
      default: 11,
    },
  },
  external: {
    contracts: [
      {
        artifacts: "node_modules/hardhat-deploy/extendedArtifacts",
      },
    ],
  },
};

export default config;
