import accounts from "../accounts.json";
import config from "../config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abi from "../../artifacts/contracts/mainChain/OmniwinMain.sol/Omniwin.json"; // If this is JSON, add assertion
import usdcAbi from "../../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion
import nftAbi from "../../artifacts/contracts/NFT721.sol/OmniwinNFT721.json"; // If this is JSON, add assertion
import {providers, Networks} from "../../providers/providers"
import {ASSET_TYPE} from "../../constants/constants"
  
async function main(){
    //only works for main chain
    const network = Networks.bnbChainTestnet;

    const prize = {
      erc20: {
        prizeAddress: config[network + "UsdcContract"],
        prizeAmount: ethers.parseUnits("1", 6),
        assetType: ASSET_TYPE.ERC20,
      },
      nft721: {
        prizeAddress: config[network + "NftContract"],
        // prizeAmount: 0, //tokenId - specify only if you want a specific token
        assetType: ASSET_TYPE.ERC721,
      }
    }

    const raffleConfig = {
        minimumFundsInWeis: ethers.parseUnits("1", 6),
        ...prize.nft721,
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
  
    if(raffleConfig.assetType === 0){
      //allow contract to spend USDC
      const usdcContract = new ethers.Contract(
        config[network + "UsdcContract"],
        usdcAbi.abi,
        wallet
      );
    
      await usdcContract.approve(contractAddress, raffleConfig.prizeAmount);
    }

    if(raffleConfig.assetType === 1){
      const nftContract = new ethers.Contract(
        config[network + "NftContract"],
        nftAbi.abi,
        wallet
      );

      //mint NFT
      if(raffleConfig.prizeAmount === undefined){
        const tx = await nftContract.mintCollectionNFT(wallet.address);
      
        const tokenId = await nftContract.currentTokenId();
        console.log(`Minted NFT with token ID: ${tokenId}`)
        raffleConfig.prizeAmount = (tokenId ).toString();

        await sleep(6000);
      }


      //approve contract to spend NFT
      await nftContract.approve(contractAddress, raffleConfig.prizeAmount);
    }
  
    const tx = await contract.createRaffle(
        raffleConfig.prizeAddress,
        raffleConfig.prizeAmount,
        raffleConfig.minimumFundsInWeis,
        raffleConfig.prices,
        raffleConfig.assetType,
        raffleConfig.deadlineDuration,
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

//sleep for 5 seconds
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}