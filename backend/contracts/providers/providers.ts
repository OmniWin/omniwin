import { ethers } from "ethers";

const bnbChainTestnetProvider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );

const baseTestnetProvider = new ethers.JsonRpcProvider("https://sepolia.base.org/");

  
export const providers = {
    "bnbChainTestnet": bnbChainTestnetProvider,
    "baseTestnet": baseTestnetProvider
}


export enum Networks {
    bnbChainTestnet = "bnbChainTestnet",
    baseTestnet = "baseTestnet"
}