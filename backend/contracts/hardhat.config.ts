import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";
import "./tasks";
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import secrets from "./secrets.json";
import "hardhat-contract-sizer";
// import "hardhat-insight";


const INFURA_API_KEY = vars.get("INFURA_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
  sourcify: {
    enabled: false,
  },  
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${secrets.sepoliaPrivateKey}`]
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${secrets.mumbaiPrivateKey}`]
    },
    bscTestnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts: [`${secrets.bscTestnetPrivateKey}`]
    },
    baseTestnet: {
      url: "https://sepolia.base.org",
      accounts: [`${secrets.baseTestnetPrivateKey}`],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "IZK72MFIWHUZRNFKKEHETSJKZCWYN7T7R1", 
      sepolia: "NJEHWWQ1EJ17X4PH2C7H9IESSVNBXTSCIV",
      bscTestnet: "Y6AHHKSJP9611YHC1NN3SXCU9B2RV9I4CI",
      baseTestnet: "UZBX9KWZAT1SZS9NDEM6W6IEPMP62TW5MF", //from base mainnet key
    },
    customChains: [
      {
        network: "baseTestnet",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com"
        }
      }
    ]
  },
};

export default config;
