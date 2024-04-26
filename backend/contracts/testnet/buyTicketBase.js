import accounts from "./accounts.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" };
import { ethers } from "ethers";
import abi from "../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json" assert { type: "json" };
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json" assert { type: "json" };

const provider = new ethers.JsonRpcProvider("https://sepolia.base.org/");

const privateKey = accounts.baseTestnetPrivateKey;
const contractAddress = config.baseContract;

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

async function callContractMethod() {
  const raffleId = 2;
  const priceId = 0;
  const usdcAmount = ethers.parseUnits("1", 6);
  const gasLimit = 300_000; //to be used by Chainlink CCIP to buy ticket on main chain

  //allow contract to spend USDC
  const usdcContract = new ethers.Contract(
    config.usdcContractBase,
    usdcAbi.abi,
    wallet
  );

  //check balance of USDC
  const balance = await usdcContract.balanceOf(wallet.address);
  console.log("USDC balance:", balance.toString());

  //check public method usdcContractAddress of contract
  const usdcContractAddress = await contract.usdcContractAddress();
  console.log("USDC contract address:", usdcContractAddress);

  const approveTx = await usdcContract.approve(contractAddress, usdcAmount);

  const nonce = await provider.getTransactionCount(wallet.address, "latest");
  console.log("Nonce:", nonce);
  //   provider.getFeeData().then((feeData) => {
  //     console.log("MaxFeePerGas:", feeData.maxFeePerGas.toString());
  //     console.log(
  //       "MaxPriorityFeePerGas:",
  //       feeData.maxPriorityFeePerGas.toString()
  //     );
  //     console.log("GasPrice:", feeData.gasPrice.toString());
  //   });
  // Fetch current gas price from the network
  const currentGasPrice = (await provider.getFeeData()).gasPrice;
  console.log("Current gas price:", currentGasPrice.toString());

  // ​    const price=(await Provider.getFeeData()).maxFeePerGas

  // ​    const price=(await Provider.getFeeData()).maxPriorityFeePerGas

  // Increase the gas price by a certain percentage to ensure it's high enough
  const adjustedGasPrice = (currentGasPrice * BigInt(130)) / BigInt(100);

  console.log("Current gas price:", currentGasPrice.toString());
  console.log("Adjusted gas price:", adjustedGasPrice.toString());
  const tx = await contract.buyEntry(raffleId, priceId, usdcAmount, gasLimit, {
    gasLimit: 500_000,
    nonce: nonce + 1,
    gasPrice: adjustedGasPrice,
  });
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
