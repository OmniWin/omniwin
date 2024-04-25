import { task } from "hardhat/config";

// Set for the sidechain contract the address of the main chain raffle contract
task("allowlistSender", "Allow external contract to send messages to the contract")
    .addParam("contract", "The address of the contract")
    .addParam("externalcontract", "The address of external contract")
    .addParam("allow", "Allow or disallow the destination chain")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const externalContract = taskArgs.externalcontract;
        const allow = taskArgs.allow;

        console.log('Contract address:', contractAddress);
        console.log('External contract address:', externalContract);
        console.log('Allow:', allow);

        const abi = [
            "function allowlistSender(address externalContract, bool allow)"
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.allowlistSender(externalContract, allow);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
