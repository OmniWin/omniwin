// Import ethers from Hardhat package
import { ethers } from "hardhat";
import { AbiCoder } from '@ethersproject/abi';
import {routerConfig,LINK_ADDRESSES} from "../../constants/constants"

async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("Omniwin");

  // Define the constructor parameters
  const vrfCoordinator =routerConfig.bnbChainTestnet.vrfCoordinator; // BNB Chain testnet VRF Coordinator
  const linkToken = LINK_ADDRESSES.bnbChainTestnet;
  const keyHash = routerConfig.bnbChainTestnet.keyHash;
  const mainnetFee = false;
  const router = routerConfig.bnbChainTestnet.address; // BNB Chain testnet Router
  const subscriptionId = 3506;

  const contract = await ContractFactory.deploy(vrfCoordinator, linkToken, keyHash, mainnetFee,router,subscriptionId);

  await contract.waitForDeployment();

  // console.log("Contract deployed to:", contract.target);

  
  // const ABI = ["address", "address", "bytes32", "bool", "address", "uint64"];
  // const values = [vrfCoordinator, linkToken, keyHash, mainnetFee, router, subscriptionId];

  // const abiCoder = new AbiCoder();
  
  // const encoded = abiCoder.encode(ABI, values);
  // console.log(`Encoded ABI for constructor params: ${encoded}`);
  console.log(contract.target);
  return contract.target;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
