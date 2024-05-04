

import { task } from "hardhat/config";

task("deployNft", "Deploys NFT contract")
    .setAction(async (taskArgs, hre) => {
        const ContractFactory = await hre.ethers.getContractFactory("OmniwinNFT721");
        const contract = await ContractFactory.deploy();
        await contract.waitForDeployment();

        console.log(contract.target);
    });

export default {
    solidity: "0.8.19",
};
