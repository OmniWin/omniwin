import { ethers } from "ethers";

const bnbChainTestnetProvider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );

//   const baseTestnetProvider = new ethers.JsonRpcProvider("https://sepolia.base.org/");
  const baseTestnetProvider = new ethers.JsonRpcProvider("https://quiet-solemn-dew.base-sepolia.quiknode.pro/a0cd7787a7641fdd7d2b84e726105298083b73ba/");


  
export const providers = {
    "bnbChainTestnet": bnbChainTestnetProvider,
    "baseTestnet": baseTestnetProvider
}


export enum Networks {
    bnbChainTestnet = "bnbChainTestnet",
    baseTestnet = "baseTestnet"
}