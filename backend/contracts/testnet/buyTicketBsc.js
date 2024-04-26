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

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

async function callContractMethod() {
  const raffleId = 2;
  const priceId = 0;
  const usdcAmount = ethers.parseUnits("1", 6);

  //allow contract to spend USDC
  const usdcContract = new ethers.Contract(
    config.usdcContractBsc,
    usdcAbi.abi,
    wallet
  );

  const approveTx = await usdcContract.approve(contractAddress, usdcAmount);

  const tx = await contract.buyEntry(raffleId, priceId, usdcAmount, {
    gasLimit: 300_000,
  });
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
