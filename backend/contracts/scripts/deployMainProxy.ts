// Import ethers from Hardhat package
import { ethers, upgrades } from "hardhat";
import {routerConfig} from "../constants/constants"

async function main() {
    const vrfCoordinatorBNB = routerConfig.bnbChainTestnet.vrfCoordinator;
    const linkTokenBNB =  routerConfig.bnbChainTestnet.feeTokens[0];
    const keyHashBNB = routerConfig.bnbChainTestnet.keyHash;
    const mainnetBNB = false;
    const routerBNB = routerConfig.bnbChainTestnet.address;

    const Box = await ethers.getContractFactory("Omniwin");
    const box = await upgrades.deployProxy(Box, [vrfCoordinatorBNB, linkTokenBNB, keyHashBNB, mainnetBNB, routerBNB]);
    await box.waitForDeployment();
    console.log("Box deployed to:", await box.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
