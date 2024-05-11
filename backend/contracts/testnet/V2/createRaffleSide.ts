import accounts from "../accounts.json";
import config from "../config.json"; // Add assertion here as well
import { ethers } from "ethers";
import abiSide from "../../artifacts/contracts/sideChain/OmniwinSide.sol/OmniwinSide.json";
import usdcAbi from "../../artifacts/contracts/USDC.sol/USDC.json"; // If this is JSON, add assertion
import nftAbi from "../../artifacts/contracts/NFT721.sol/OmniwinNFT721.json"; // If this is JSON, add assertion
import {providers, Networks} from "../../providers/providers"
import {ASSET_TYPE} from "../../constants/constants"
  
async function main(){
    //only works for main chain
    const network = Networks.baseTestnet;
    const selectedPrize = ASSET_TYPE.ERC721;

    const prize = {
       [ASSET_TYPE.ERC20]: {
        prizeAddress: config[network + "UsdcContract"],
        prizeAmount: ethers.parseUnits("1", 6),
        assetType: ASSET_TYPE.ERC20
      },
      [ASSET_TYPE.ERC721]: {
        prizeAddress: config[network + "NftContract"],
        // prizeAmount: 0, //tokenId - specify only if you want a specific token
        assetType: ASSET_TYPE.ERC721
      }
    }

    const gasLimitTx = {
        "baseTestnet": {
            [ASSET_TYPE.ERC20] : {
                gasLimit: 350_000
            },
            [ASSET_TYPE.ERC721] : {
                gasLimit: 650_000
            }
        },
        "bnbChainTestnet": {
            [ASSET_TYPE.ERC20] : {
                gasLimit: 350_000
            },
            [ASSET_TYPE.ERC721] : {
                gasLimit: 650_000
            }
        }
    }

    const txConfig = {
        "bnbChainTestnet": {
            gasLimit: 350_000
        },
        "baseTestnet": {
            gasLimit: gasLimitTx[network][selectedPrize].gasLimit,
            gasPrice: ((await providers[network].getFeeData()).gasPrice * BigInt(130)) / BigInt(100)
        }
    }

    const raffleConfig = {
        minimumFundsInWeis: ethers.parseUnits("1", 6),
        ...prize[ASSET_TYPE.ERC20],
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
        gasLimit: 400_000, //gas needed for the transaction to execute on the mainchain
        approveAmount: {
            "baseTestnet": ethers.parseUnits("0.5", 6) //ccip message fee
        },
        transactionOptions: {
            ...txConfig[network]
        }
    }
    await createRaffle(network, providers[network],raffleConfig);
}

async function createRaffle(network: string, provider: ethers.JsonRpcProvider, raffleConfig: any){
    const privateKey = accounts[network + "PrivateKey"];
    const contractAddress = config[network+ "Contract"];

    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, abiSide.abi, wallet);
    const nonce = await provider.getTransactionCount(wallet.address, "latest");
    console.log("Wallet: ", wallet.address);

    const usdcContract = new ethers.Contract(
        config[network + "UsdcContract"],
        usdcAbi.abi,
        wallet
      );
  
   
    if(raffleConfig.assetType === 1){
      const nftContract = new ethers.Contract(
        config[network + "NftContract"],
        nftAbi.abi,
        wallet
      );

      //mint NFT
      if(raffleConfig.prizeAmount === undefined){
        const tx = await nftContract.mintCollectionNFT(wallet.address, {
            gasLimit: 300_000,
            gasPrice: ((await providers[network].getFeeData()).gasPrice * BigInt(130)) / BigInt(100),
            nonce: nonce
            }
        );
      
        const tokenId = await nftContract.currentTokenId();
        raffleConfig.prizeAmount = (tokenId - BigInt(1)).toString();
        console.log("Token ID:", raffleConfig.prizeAmount);
      }


      //approve contract to spend NFT
      await nftContract.approve(contractAddress, raffleConfig.prizeAmount,{
        gasLimit: 300_000,
        gasPrice: ((await providers[network].getFeeData()).gasPrice * BigInt(130)) / BigInt(100),
        nonce: nonce + 1
      });
    }


    if(raffleConfig.assetType === 0){
        const totalAmount = raffleConfig.prizeAmount + raffleConfig.approveAmount[network];
        await usdcContract.approve(contractAddress, totalAmount);
    }else{
        //only fee
        await usdcContract.approve(contractAddress, raffleConfig.approveAmount[network],{
            gasLimit: 300_000,
            gasPrice: ((await providers[network].getFeeData()).gasPrice * BigInt(130)) / BigInt(100),
            nonce: nonce + 2
        });
    }

  
    console.log(raffleConfig);
    const tx = await contract.CreateRaffleCCIP(
        raffleConfig.prizeAddress,
        raffleConfig.prizeAmount,
        raffleConfig.minimumFundsInWeis,
        raffleConfig.prices,
        raffleConfig.assetType,
        raffleConfig.deadlineDuration,
        raffleConfig.gasLimit,
      {
        ...raffleConfig.transactionOptions,
        nonce: nonce + 3
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
    }).find(log => log?.name === "CreateRaffleCCIPEvent");

    if (eventEmittedLogs && eventEmittedLogs.args) {
        const raffleId = eventEmittedLogs.args.raffleId;
        console.log("Raffle ID:", raffleId);
        return raffleId;  // Optionally return it from the function
    } else {
        console.error("CreateRaffleCCIPEvent event not found or parsing failed");
    }
}


main().catch(console.error);