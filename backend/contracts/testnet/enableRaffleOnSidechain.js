import accounts from "./accounts.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" }; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json" assert { type: "json" }; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json" assert { type: "json" }; // If this is JSON, add assertion

const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545"
);

const privateKey = accounts.nbnTestnetPrivateKey;
const contractAddress = config.bscContract;

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

async function callContractMethod() {
  const raffleId =
    "0xc5c9b01c25b16af962acdddc595e5cefa777c9a1c089d6495c57f818872a3e70";
  const chainSelectors = {
    ccnsReceiverAddress: config.sepoliaContract,
    chainSelector: config.sepoliaSelector,
    gasLimit: 350_000,
  };

  console.log(
    "Enabling raffle on sidechain with chain selectors:",
    chainSelectors
  );

  //read allowlistedDestinationChains public mapping
  const allowlistedDestinationChains =
    await contract.allowlistedDestinationChains(config.sepoliaSelector);

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
      gasLimit: 300_000,
    }
  );
  await tx.wait();
  console.log("Transaction successful:", tx);
}

// Execute the function
callContractMethod().catch(console.error);
