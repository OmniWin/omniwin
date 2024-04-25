import accounts from "./accounts.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" }; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json" assert { type: "json" }; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json" assert { type: "json" }; // If this is JSON, add assertion

const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const privateKey = accounts.bscTestnetPrivateKey;
const contractAddress = config.bscContract;
const contractABI = [
  // Include the ABI for the method you want to call, for example:
  "function myMethod(uint256 value)",
];

// Setup provider and wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

// Example function call: myMethod with parameter
async function callContractMethod() {
  const minimumFundsInWeis = ethers.parseEther("1");
  const assetType = 0; // ERC20 token, adjust based on enum order
  const prizeAddress = config.usdcContract; // Token contract
  const prizeAmount = ethers.parseUnits("1", 6); // Number of tokens to be used as the prize
  const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
  const prices = [
    {
      id: 0,
      numEntries: 1,
      price: ethers.parseUnits("1", 6),
    },
    {
      id: 1,
      numEntries: 5,
      price: ethers.parseUnits("3", 6), // Slight discount for buying more
    },
  ];

  //allow contract to spend USDC
  const usdcContract = new ethers.Contract(
    config.usdcContract,
    usdcAbi.abi,
    wallet
  );

  const approveTx = await usdcContract.approve(contractAddress, prizeAmount);

  const tx = await contract.createRaffle(
    prizeAddress,
    prizeAmount,
    minimumFundsInWeis,
    prices,
    assetType,
    deadlineDuration,
    {
      gasLimit: 3000000,
    }
  );
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
