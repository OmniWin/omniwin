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

        
    const fromChain = networkName === "bscTestnet" ? "bnbChainTestnet" : "bnbChainTestnet";
    const routeAddress = routerConfig[fromChain].address;
    const linkAddress = LINK_ADDRESSES[fromChain];

    const spinner: Spinner = new Spinner();

    console.log(`ℹ️  Attempting to deploy BasicMessageSender on the ${fromChain} blockchain using ${deployer.address} address, with the Router address ${routeAddress} and LINK address ${linkAddress} provided as constructor arguments`);
    spinner.start();
    
    const SenderContract = await ethers.getContractFactory("SideChainRaffle");
    const sender = await SenderContract.deploy(routeAddress,linkAddress);

    spinner.stop();
    console.log(`✅ BasicMessageSender deployed at address ${sender.target} on ${fromChain} blockchain`)


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/**
 * /args: 1 = contract address, 2 = router address 3 = link address 
 * npx hardhat verify --network bscTestnet 0x1382732AC73d4D95D82761d10ff1F0940091717D 0xE1053aE1857476f36A3C62580FF9b016E8EE8F6f 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06
Deploying contracts with the account: 0x0D3a20651f95c5193F4c7c37311a74831981408a
Sender contract deployed to: 0x1382732AC73d4D95D82761d10ff1F0940091717D
 */