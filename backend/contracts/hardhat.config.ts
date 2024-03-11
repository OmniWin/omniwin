import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { vars } from "hardhat/config";
import "./tasks";
import "@nomicfoundation/hardhat-ethers";
import secrets from "./secrets.json";

const INFURA_API_KEY = vars.get("INFURA_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
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
  },
  etherscan: {
    apiKey: {
      polygonMumbai: "IZK72MFIWHUZRNFKKEHETSJKZCWYN7T7R1", 
      sepolia: "NJEHWWQ1EJ17X4PH2C7H9IESSVNBXTSCIV"
    },
  },
};

export default config;
