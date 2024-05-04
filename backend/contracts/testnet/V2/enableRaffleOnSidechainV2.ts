import accounts from "../accounts.json";
import config from "../config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json"; // If this is JSON, add assertion
import usdcAbi from "../../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion
import {providers, Networks} from "../../providers/providers"
  
async function main(){
    //enable raffle fromNework to toNetwork
    const fromNetwork = Networks.bnbChainTestnet;
    const toNetwork = Networks.baseTestnet;
    const raffleId = "0x2ac398cd71e68307f8be8537533aeed4ece42f95ee9cf2087067acf048f227ee";

    const raffleConfig = {
        raffleId: raffleId,
        chainSelectors:{
          ccnsReceiverAddress: config[toNetwork + "Contract"],
          chainSelector: config[toNetwork + "Selector"],
          gasLimit: 450_000, //gas needed for the transaction to execute on the sidechain
        },
        ccipMessageFee: ethers.parseUnits("1", 6), //fee needed to send a message to the sidechain
        transactionOptions: {
            gasLimit:600_000 //gas needed for the transaction to execute on the mainchain (this should also include the gas needed for the sidechain transaction)
        }
    }
    await enableRaffleOnSidechain(fromNetwork, providers[fromNetwork], raffleConfig);
}

async function enableRaffleOnSidechain(fromNetwork: string, provider: ethers.JsonRpcProvider, raffleConfig: {
  raffleId: string,
  chainSelectors:{
    ccnsReceiverAddress: string,
    chainSelector: string,
    gasLimit: number
  },
  ccipMessageFee: ethers.BigNumberish,
  transactionOptions: {
    gasLimit: number
  }
}){
    const privateKey = accounts[fromNetwork + "PrivateKey"];
    const contractAddress = config[fromNetwork+ "Contract"];

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi.abi, wallet);

    console.log("Wallet: ", wallet.address);
  
    //allow contract to spend USDC
    const usdcContract = new ethers.Contract(
      config[fromNetwork + "UsdcContract"],
      usdcAbi.abi,
      wallet
    );
  
    await usdcContract.approve(contractAddress, raffleConfig.ccipMessageFee);

    // Simulate the transaction to estimate gas
    // const estimatedGas = await contract.enableCreateRaffleOnSidechain.estimateGas(
    //   raffleConfig.raffleId,
    //   raffleConfig.chainSelectors,
    //   {
    //       ...raffleConfig.transactionOptions,
    //       from: wallet.address  // Ensure to include the 'from' field if necessary
    //   }
    // );
    // console.log("Estimated Gas: ", estimatedGas.toString());

    // // You might want to add a buffer to the estimated gas to account for variability
    // const gasLimit = estimatedGas * (BigInt(130) / BigInt(100));

      
    const tx = await contract.enableCreateRaffleOnSidechain(
        raffleConfig.raffleId,
        raffleConfig.chainSelectors,
      {
        ...raffleConfig.transactionOptions,
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
    }).find(log => log?.name === "CreateRaffleToSidechain");

    if (eventEmittedLogs && eventEmittedLogs.args) {
        const raffleId = eventEmittedLogs.args.raffleId;
        console.log("Raffle ID:", raffleId);
        return raffleId;  // Optionally return it from the function
    } else {
        console.error("enableRaffleOnSidechain event not found or parsing failed");
    }
}


main().catch(console.error);