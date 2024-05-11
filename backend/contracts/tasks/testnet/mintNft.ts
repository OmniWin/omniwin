import { task } from "hardhat/config";

// Defining the task
task("mintNft", "Mint NFT token to address (incremental tokenId)")
    .addParam("contract", "The address of the nft contract")
    .addParam("to", "The address of the recipient")
    .setAction(async (taskArgs, hre) => {
        const contractAddress = taskArgs.contract;
        const to = taskArgs.to;

        const abi = [
            "function mintCollectionNFT(address to)",
            "function currentTokenId() view returns (uint256)"
        ];

        const signer = await hre.ethers.getSigners();  // Automatically handled by Hardhat
        const contract = new hre.ethers.Contract(contractAddress, abi, signer[0]);

        const txResponse = await contract.mintCollectionNFT(to);
        await txResponse.wait();  // Wait for the transaction to be mined

        //get the tokenId
        const tokenId = await contract.currentTokenId();

        console.log(tokenId);
    });

export default {
    solidity: "0.8.4",
};
