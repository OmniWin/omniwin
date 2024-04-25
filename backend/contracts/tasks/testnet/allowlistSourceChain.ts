import { task } from "hardhat/config";

// Set for the sidechain contract the address of the main chain raffle contract
task("allowlistSourceChain", "Set the source chain selector on a given contract")
    .addParam("contract", "The address of the contract")
    .addParam("selector", "The destination chain selector")
    .addParam("allow", "Allow or disallow the destination chain")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const selector = taskArgs.selector;
        const allow = taskArgs.allow;

        console.log('Contract address:', contractAddress);
        console.log('Chain selector:', selector);
        console.log('Allow:', allow);

        const abi = [
            "function allowlistSourceChain(uint64 selector, bool allow)"  
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.allowlistSourceChain(selector, allow);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
