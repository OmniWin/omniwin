import accounts from "./accounts.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" }; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json" assert { type: "json" }; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json" assert { type: "json" }; // If this is JSON, add assertion

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org/");

const privateKey = accounts.baseTestnetPrivateKey;
const contractAddress = config.baseContract;

// Setup provider and wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

// Example function call: myMethod with parameter
async function callContractMethod() {
  const minimumFundsInWeis = ethers.parseEther("1"); //i believe this is wrong, it should be ethers.parseUnits("1", 6)
  const assetType = 0; // ERC20 token, adjust based on enum order
  const prizeAddress = config.usdcContractBase; // Token contract
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
    config.usdcContractBase,
    usdcAbi.abi,
    wallet
  );

  const approveTx = await usdcContract.approve(contractAddress, prizeAmount);

  // Fetch current gas price from the network
  const currentGasPrice = (await provider.getFeeData()).gasPrice;
  console.log("Current gas price:", currentGasPrice.toString());
  const adjustedGasPrice = (currentGasPrice * BigInt(130)) / BigInt(100);

  const gasLimitSyn = 1_000_000;
  const gasLimitSynAck = 400_000;
  const gasLimitForAck = 100_000;
  const tx = await contract.CreateRaffleCCIP(
    prizeAddress,
    prizeAmount,
    minimumFundsInWeis,
    prices,
    assetType,
    deadlineDuration,
    gasLimitSyn,
    gasLimitSynAck,
    gasLimitForAck,
    {
      gasLimit: 400_000,
      gasPrice: adjustedGasPrice,
    }
  );

  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
