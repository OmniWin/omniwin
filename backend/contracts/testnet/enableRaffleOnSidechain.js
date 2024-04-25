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

// Setup provider and wallet
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

// Example function call: myMethod with parameter
async function callContractMethod() {
  const raffleId = 0;
  const chainSelectors = {
    ccnsReceiverAddress: config.baseContract,
    chainSelector: config.baseSelector,
    gasLimit: 500_000,
    strict: false,
  };

  console.log(
    "Enabling raffle on sidechain with chain selectors:",
    chainSelectors
  );

  //read allowlistedDestinationChains public mapping
  const allowlistedDestinationChains =
    await contract.allowlistedDestinationChains(config.baseSelector);

  console.log("allowlistedDestinationChains:", allowlistedDestinationChains);
  const tx = await contract.enableCreateRafffleOnSidechain(
    raffleId,
    chainSelectors,
    {
      gasLimit: 300_000,
    }
  );
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
