import accounts from "./accounts.json";
import config from "./config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json"; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion

const provider = new ethers.JsonRpcProvider(
  "https://quiet-solemn-dew.base-sepolia.quiknode.pro/a0cd7787a7641fdd7d2b84e726105298083b73ba/"
  // "https://sepolia.infura.io/v3/9d9284a66189412282e5c644ad094a93"
);

const privateKey = accounts.baseTestnetPrivateKey;
const contractAddress = config.baseTestnetContract;

// Setup provider and wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

// Example function call: myMethod with parameter
async function callContractMethod() {
  const minimumFundsInWeis = ethers.parseUnits("1", 6);
  const assetType = 0; // ERC20 token, adjust based on enum order
  const prizeAddress = config.baseTestnetUsdcContract; // Token contract
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

  const usdcContract = new ethers.Contract(
    config.baseTestnetUsdcContract,
    usdcAbi.abi,
    wallet
  );

  // Fetch current gas price from the network
  const currentGasPrice = (await provider.getFeeData()).gasPrice;
  console.log("Current gas price:", currentGasPrice.toString());
  const adjustedGasPrice = (currentGasPrice * BigInt(190)) / BigInt(100);

  console.log("Wallet address:", wallet.address);
  const ccipMessageFee = ethers.parseUnits("0.5", 6);
  const approveTx = await usdcContract.approve(
    contractAddress,
    prizeAmount + ccipMessageFee
  );

  const nonce = await provider.getTransactionCount(wallet.address, "latest");

  console.log("Create raffle on sidechain with nonce:", nonce);
  const gasLimit = 350_000;
  const tx = await contract.CreateRaffleCCIP(
    prizeAddress,
    prizeAmount,
    minimumFundsInWeis,
    prices,
    assetType,
    deadlineDuration,
    gasLimit,
    {
      gasLimit: 650_000,
      gasPrice: adjustedGasPrice,
      nonce: nonce,
    }
  );

  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
