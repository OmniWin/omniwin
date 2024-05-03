import { task } from "hardhat/config";
import {
    routerConfig,
    LINK_ADDRESSES,
    RouterConfig,
  } from "../../constants/constants";

// Defining the task
task("addLinkToken", "Sets the USDC token address on a given contract")
    .addParam("to", "The address of the recipient")
    .addParam("amount", "The address of the USDC token")
    .setAction(async (taskArgs, hre) => {
        //transfer Link token to the contract
        const amount = taskArgs.amount * 10 ** 18;
        const toContract = taskArgs.to;
        const deploymentNetwork = hre.network.name;

        const linkToken = LINK_ADDRESSES[deploymentNetwork as keyof RouterConfig];

        //My address has link, so I will transfer to the contract
        const linkTokenContract = await hre.ethers.getContractAt("IERC20", linkToken);

        //Transfer link to the contract
        await linkTokenContract.transfer(toContract, amount);

    });

export default {
    solidity: "0.8.4",
};
