import { task } from "hardhat/config";

// Defining the task
task("mintUSDC", "Sets the USDC token address on a given contract")
    .addParam("contract", "The address of the usdc contract")
    .addParam("amount", "The address of the USDC token")
    .addParam("to", "The address of the recipient")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const amount = taskArgs.amount;
        const to = taskArgs.to;

        console.log('Contract address:', contractAddress);
        console.log('USDC amount to mint:', amount);

        const abi = [
            "function mint(address to, uint256 amount)"
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.mint(to, amount);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
