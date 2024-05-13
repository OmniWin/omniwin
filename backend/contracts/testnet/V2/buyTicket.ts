import accounts from "../accounts.json";
import config from "../config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abiMain from "../../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json"; // If this is JSON, add assertion
import abiSide from "../../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json";
import usdcAbi from "../../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion
import {providers, Networks} from "../../providers/providers"


async function main(){
    const network = Networks.baseTestnet;
    const raffleId = "0xe1804c999f12a0e4113d7189fe5da104b59a372549f20d5afb902eef911a47b4";

    console.log("Buying ticket for raffleId: ", raffleId, " on network: ", network);

    const abi = {
        "bnbChainTestnet": abiMain.abi,
        "baseTestnet": abiSide.abi
    }

    const txConfig = {
        "bnbChainTestnet": {
            gasLimit: 350_000
        },
        "baseTestnet": {
            gasLimit: 350_000,
            gasPrice: ((await providers[network].getFeeData()).gasPrice * BigInt(130)) / BigInt(100)
        }
    }

    const methodConfig = {
        params: {
            "bnbChainTestnet": {
                raffleId: raffleId,
                priceId: 0,
            },
            "baseTestnet": {
                raffleId: raffleId,
                priceId: 0,
                gasLimit: 400_000
            }
        },
        approveAmount: {
            "bnbChainTestnet": ethers.parseUnits("1", 6), //mainnet has no ccip fee
            "baseTestnet": ethers.parseUnits("1", 6) + ethers.parseUnits("0.5", 6) //ccip message fee
        },
        transactionOptions: {
            ...txConfig[network]
        }
    }
    await buyEntry(network, providers[network],methodConfig,abi);
}

async function buyEntry(network: string, provider: ethers.JsonRpcProvider, methodConfig: {
    params: {
        [network: string]: {
            raffleId: string,
            priceId: number,
            gasLimit?: number
        }
    },
    approveAmount: {
        [network: string]:ethers.BigNumberish
    },
    transactionOptions: {
        gasLimit: number
    }
}, abi: {
    [network: string]: any
}){
    const privateKey = accounts[network + "PrivateKey"];
    const contractAddress = config[network+ "Contract"];

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abi[network], wallet);

    console.log("Wallet: ", wallet.address);
  
    //allow contract to spend USDC
    const usdcContract = new ethers.Contract(
      config[network + "UsdcContract"],
      usdcAbi.abi,
      wallet
    );
  
    await usdcContract.approve(contractAddress, methodConfig.approveAmount[network]);
  
     // Prepare dynamic parameters based on the network
     const params = methodConfig.params[network];
     const args = [
         params.raffleId,
         params.priceId
     ];
     if (params.gasLimit !== undefined) args.push(params.gasLimit);

    const tx = await contract.buyEntry(
        ...args,
      {
        ...methodConfig.transactionOptions,
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
    }).find(log => log?.name === "EntrySold");

    if (eventEmittedLogs && eventEmittedLogs.args) {
        const raffleId = eventEmittedLogs.args.raffleId;
        console.log("Bought ticket for raffleId: ", raffleId, " with priceId: ", methodConfig.params[network].priceId, " and approve amount: ", methodConfig.approveAmount[network]);
        return raffleId;
    } else {
        console.error("CreateRaffle event not found or parsing failed");
    }

}


main().catch(console.error);
