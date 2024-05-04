import accounts from "./accounts.json";
import config from "./config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json"; // If this is JSON, add assertion
import usdcAbi from "../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion

const bnbChainTestnetProvider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s1.binance.org:8545"
  );

  
async function main(){
    const network = "bnbChainTestnet";

    const providers = {
        [network]: bnbChainTestnetProvider
    }

    const raffleConfig = {
        minimumFundsInWeis: ethers.parseUnits("1", 6),
        assetType: 0, // ERC20 token, adjust based on enum order
        prizeAddress: config[network + "UsdcContract"], // Token contract
        prizeAmount: ethers.parseUnits("1", 6), // Number of tokens to be used as the prize
        deadlineDuration: 60 * 60 * 24 * 7, // 7 days
        prices: [
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
        ],
        transactionOptions: {
            gasLimit: 350_000
        }
    }
    await createRaffle(network, providers[network],raffleConfig);
}

async function createRaffle(network: string, provider: ethers.JsonRpcProvider, raffleConfig: any){
    const privateKey = accounts[network + "PrivateKey"];
    const contractAddress = config[network+ "Contract"];

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

    console.log("Wallet: ", wallet.address);
  
    //allow contract to spend USDC
    const usdcContract = new ethers.Contract(
      config[network + "UsdcContract"],
      usdcAbi.abi,
      wallet
    );
  
    await usdcContract.approve(contractAddress, raffleConfig.prizeAmount);
  
    const tx = await contract.createRaffle(
        raffleConfig.prizeAddress,
        raffleConfig.prizeAmount,
        raffleConfig.minimumFundsInWeis,
        raffleConfig.prices,
        raffleConfig.assetType,
        raffleConfig.deadlineDuration,
      {
        gasLimit: raffleConfig.transactionOptions.gasLimit,
      }
    );
    const receipt = await tx.wait();
    console.log("Transaction successful:", tx.hash);

        // Parse the transaction receipt to find the event logs
    const eventEmittedLogs = receipt.logs?.map(log => {
      try {
          return contract.interface.parseLog(log);
      } catch {
          // This is to ignore errors from logs that are not from the current contract
          return null;
      }
    }).find(log => log?.name === "CreateRaffle");

    if (eventEmittedLogs && eventEmittedLogs.args) {
        const raffleId = eventEmittedLogs.args.raffleId;
        console.log("Raffle ID:", raffleId);
        return raffleId;  // Optionally return it from the function
    } else {
        console.error("CreateRaffle event not found or parsing failed");
    }
}


main().catch(console.error);