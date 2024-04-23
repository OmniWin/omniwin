// Import ethers from Hardhat package
import { ethers } from "hardhat";
import { AbiCoder } from '@ethersproject/abi';


async function main() {
  // Get the ContractFactory for your contract
  const ContractFactory = await ethers.getContractFactory("Omniwin");

  // Define the constructor parameters
  const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"; // BNB Chain testnet VRF Coordinator
  const linkToken = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";
  const keyHash = "0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314";
  const mainnetFee = false;
  const router = "0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f"; // BNB Chain testnet Router
  const subscriptionId = 3506;

  const contract = await ContractFactory.deploy(vrfCoordinator, linkToken, keyHash, mainnetFee,router,subscriptionId);

  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract.target);

  
  const ABI = ["address", "address", "bytes32", "bool", "address", "uint64"];
  const values = [vrfCoordinator, linkToken, keyHash, mainnetFee, router, subscriptionId];

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
