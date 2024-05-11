import { task } from "hardhat/config";

// Set for the sidechain contract the address of the main chain raffle contract
task("setMainChainSelectorToSidechain", "Sets the USDC token address on a given contract")
    .addParam("contract", "The address of the contract")
    .addParam("selector", "The destination chain selector")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const selector = taskArgs.selector;

        console.log('Contract address:', contractAddress);
        console.log('Chain selector:', selector);

        const abi = [
            "function setMainChainSelector(uint64 selector)"  
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.setMainChainSelector(selector);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
