import { task } from "hardhat/config";
import {
    routerConfig,
    LINK_ADDRESSES,
    RouterConfig,
  } from "../../constants/constants";
  

// Defining the task
task("addLinkToken", "Transfer link token to the contract")
    .addParam("to", "The contract of the recipient")
    .addParam("amount", "The amount of link token")
    .setAction(async (taskArgs, hre) => {

        const erc20Abi = [
            // balanceOf
            "function balanceOf(address owner) view returns (uint256)",
            // transfer
            "function transfer(address to, uint256 amount) returns (bool)",
            // Add more functions as needed
        ];
        
        //transfer Link token to the contract
        const amount = hre.ethers.parseUnits(taskArgs.amount, 18); 
        const toContract = taskArgs.to;
        const deploymentNetwork = hre.network.name;

        const linkToken = LINK_ADDRESSES[deploymentNetwork as keyof RouterConfig];
        if (!linkToken) {
            throw new Error(`LINK token address not configured for network: ${deploymentNetwork}`);
        }

        //My address has link, so I will transfer to the contract
        const linkTokenContract = await hre.ethers.getContractAt(erc20Abi, linkToken);

        //Transfer link to the contract
        console.log(`Transferring ${amount} LINK (${linkToken}) to ${toContract}, from wallet: ${hre.config.networks.hardhat.accounts[0]}`);
        await linkTokenContract.transfer(toContract, amount);

    });

export default {
    solidity: "0.8.4",
};
