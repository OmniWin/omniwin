import accounts from "./accounts.json";
import config from "./config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json"; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion

const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const privateKey = accounts.bnbChainTestnetPrivateKey;
const contractAddress = config.bscContract;

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

async function callContractMethod() {
  const raffleId =
    "0x2ac398cd71e68307f8be8537533aeed4ece42f95ee9cf2087067acf048f227ee";
  const chainSelectors = {
    ccnsReceiverAddress: config.baseContract,
    chainSelector: config.baseSelector,
    gasLimit: 450_000,
  };

  console.log(
    "Enabling raffle on sidechain with chain selectors:",
    chainSelectors
  );

  //read allowlistedDestinationChains public mapping
  const allowlistedDestinationChains =
    await contract.allowlistedDestinationChains(config.baseSelector);

  //allow contract to spend USDC
  const usdcContract = new ethers.Contract(
    config.usdcContractBsc,
    usdcAbi.abi,
    wallet
  );

  const ccipMessageFee = ethers.parseUnits("0.5", 6);
  const approveTx = await usdcContract.approve(contractAddress, ccipMessageFee);

  console.log("allowlistedDestinationChains:", allowlistedDestinationChains);
  const tx = await contract.enableCreateRaffleOnSidechain(
    raffleId,
    chainSelectors,
    {
      gasLimit: 600_000,
    }
  );
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
