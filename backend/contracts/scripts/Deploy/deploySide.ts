// Import ethers from Hardhat package
import { ethers } from "hardhat";
import { AbiCoder } from '@ethersproject/abi';


async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("OmniwinSide");

  // Define the constructor parameters
  const router = "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93"; // Base Chain testnet Router
  const linkToken = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410";

  const contract = await ContractFactory.deploy(router, linkToken);

  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);

  
  const ABI = ["address", "address"];
  const values = [router, linkToken];

  const abiCoder = new AbiCoder();
  
  const encoded = abiCoder.encode(ABI, values);
  console.log(`Encoded ABI for constructor params: ${encoded}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
