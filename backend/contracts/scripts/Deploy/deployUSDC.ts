// Import ethers from Hardhat package
import { ethers } from "hardhat";
import { AbiCoder } from '@ethersproject/abi';


async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("USDC");
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
