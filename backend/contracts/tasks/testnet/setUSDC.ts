import { task } from "hardhat/config";

// Defining the task
task("setUSDC", "Sets the USDC token address on a given contract")
    .addParam("contract", "The address of the contract")
    .addParam("usdc", "The address of the USDC token")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const usdcTokenAddress = taskArgs.usdc;

        console.log('Contract address:', contractAddress);
        console.log('USDC Token address:', usdcTokenAddress);

        const abi = [
            "function setUSDCTokenAddress(address _usdcContractAddress)"
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.setUSDCTokenAddress(usdcTokenAddress);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
