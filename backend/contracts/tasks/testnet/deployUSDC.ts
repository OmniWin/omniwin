

import { task } from "hardhat/config";

task("deployUSDC", "Deploys USDC contract")
    .setAction(async (taskArgs, hre) => {
        const ContractFactory = await hre.ethers.getContractFactory("USDC");
        const contract = await ContractFactory.deploy();
        await contract.waitForDeployment();

        console.log(contract.target);
    });

export default {
    solidity: "0.8.19",
};
