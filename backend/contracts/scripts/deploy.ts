// Import ethers from Hardhat package
import { ethers } from "hardhat";

async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("Omniwin");

  // Define the constructor parameters
  const vrfCoordinator = "0xYourVrfCoordinatorAddress";
  const linkToken = "0xYourLinkTokenAddress";
  const keyHash = "0xYourKeyHash";
  const mainnetFee = true; // or false, depending on your needs

  // Deploy the contract with the constructor parameters
  const contract = await ContractFactory.deploy(vrfCoordinator, linkToken, keyHash, mainnetFee);

  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
