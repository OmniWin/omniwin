import { task } from "hardhat/config";

// Set for the sidechain contract the address of the main chain raffle contract
task("setMainChainRaffleToSidechain", "Sets the USDC token address on a given contract")
    .addParam("contract", "The address of the contract")
    .addParam("raffle", "The address of the main contract where the raffle is held")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const raffleAddress = taskArgs.raffle;

        console.log('Contract address:', contractAddress);
        console.log('Raffle address:', raffleAddress);

        const abi = [
            "function setMainChainRaffleAddress(address _raffleContractAddress)"  
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.setMainChainRaffleAddress(raffleAddress);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
