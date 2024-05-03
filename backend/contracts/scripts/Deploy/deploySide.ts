// Import ethers from Hardhat package
import { ethers } from "hardhat";
import { AbiCoder } from '@ethersproject/abi';
import {routerConfig,LINK_ADDRESSES} from "../../constants/constants"


async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("OmniwinSide");

  // Define the constructor parameters
  const router =  routerConfig.ethereumSepolia.address; // X Chain testnet Router
  const linkToken = LINK_ADDRESSES.ethereumSepolia;

  const contract = await ContractFactory.deploy(router, linkToken);

  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);

  
  // const ABI = ["address", "address"];
  // const values = [router, linkToken];

  // const abiCoder = new AbiCoder();
  
  // const encoded = abiCoder.encode(ABI, values);
  // console.log(`Encoded ABI for constructor params: ${encoded}`);

  return contract.target;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
