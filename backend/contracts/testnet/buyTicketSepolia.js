import accounts from "./accounts.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" };
import { ethers } from "ethers";
import abi from "../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json" assert { type: "json" };
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/9d9284a66189412282e5c644ad094a93"
);

const privateKey = accounts.sepoliaPrivateKey;
const contractAddress = config.sepoliaContract;

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

async function callContractMethod() {
  const raffleId =
    "0x7a2cea0a6279bb6110e5d97502d698d1ec067f1c35b5cff355cfe2aaefcf7436";
  const priceId = 0;
  const usdcAmount = ethers.parseUnits("1", 6);
  const gasLimit = 300_000; //to be used by Chainlink CCIP to buy ticket on main chain

  //allow contract to spend USDC
  const usdcContract = new ethers.Contract(
    config.usdcContractSepolia,
    usdcAbi.abi,
    wallet
  );

  //check balance of USDC
  const balance = await usdcContract.balanceOf(wallet.address);
  console.log(
    "USDC balance:",
    balance.toString(),
    "from contract:",
    config.usdcContractSepolia
  );

  //check public method usdcContractAddress of contract
  const usdcContractAddress = await contract.usdcContractAddress();

  const ccipMessageFee = ethers.parseUnits("0.5", 6);
  const totalAmount = ccipMessageFee + usdcAmount;

  const approveTx = await usdcContract.approve(contractAddress, totalAmount);

  console.log("Wallet address:", wallet.address);
  console.log("USDC contract address config:", config.usdcContractBase);
  console.log("USDC contract address contract:", usdcContractAddress);

  const tx = await contract.buyEntry(raffleId, priceId, gasLimit, {
    gasLimit: 400_000,
  });
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
