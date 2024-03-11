import { ethers,network } from "hardhat";
import {routerConfig} from "../constants/constants";
import { Spinner } from "../utils/spinner";
import { LINK_ADDRESSES } from "../constants/constants";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Access the network name directly from the Hardhat Runtime Environment
    const networkName = network.name;
    console.log(`Current network: ${networkName}`);

        
    const fromChain = networkName === "sepolia" ? "ethereumSepolia" : "ethereumSepolia";
    const routeAddress = routerConfig[fromChain].address;
    const linkAddress = LINK_ADDRESSES[fromChain];

    const spinner: Spinner = new Spinner();

    console.log(`ℹ️  Attempting to deploy BasicMessageSender on the ${fromChain} blockchain using ${deployer.address} address, with the Router address ${routeAddress} and LINK address ${linkAddress} provided as constructor arguments`);
    spinner.start();
    
    const SenderContract = await ethers.getContractFactory("CCIPSender");
    const sender = await SenderContract.deploy(routeAddress,linkAddress);

    spinner.stop();
    console.log(`✅ BasicMessageSender deployed at address ${sender.target} on ${fromChain} blockchain`)


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/**
Deploying contracts with the account: 0x6Ee234184880D8C6Eda599A0aB0FB678b7de8809
Sender contract deployed to: 0x20E80C8CAd2559bF342F58B877041F04C9a85038
 */