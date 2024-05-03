import { HardhatUserConfig, task, types } from "hardhat/config";
import {routerConfig,LINK_ADDRESSES, RouterConfig} from "../constants/constants"

task("deploySide", "Deploy the side contract")
    .setAction(async (taskArgs, hre) => {
        const deploymentNetwork = hre.network.name;

        const ContractFactory = await hre.ethers.getContractFactory("OmniwinSide");

        const router =  routerConfig[deploymentNetwork as keyof RouterConfig].address; // X Chain testnet Router
        const linkToken = LINK_ADDRESSES[deploymentNetwork];

        const contract = await ContractFactory.deploy(router, linkToken);

        await contract.waitForDeployment();

        console.log(contract.target);

    });
