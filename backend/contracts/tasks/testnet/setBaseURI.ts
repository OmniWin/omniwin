import { task } from "hardhat/config";

// Defining the task
task("setBaseURI", "Sets the base URI on a given NFT contract")
    .addParam("contract", "The address of the nft contract")
    .addParam("uri", "The address of the USDC token")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const baseUri = taskArgs.uri;

        console.log('Contract address: ', contractAddress);
        console.log('Base URI: ', baseUri);

        const abi = [
            "function setBaseURI(string uri)",
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.setBaseURI(baseUri);
        await txResponse.wait();  // Wait for the transaction to be mined

        console.log('Transaction successful:', txResponse.hash);
    });

export default {
    solidity: "0.8.4",
};
