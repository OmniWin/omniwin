import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ReceiverContract = await ethers.getContractFactory("CCIPReceiverContract");
    const ROUTER_NUMBAI = "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1";

    const receiver = await ReceiverContract.deploy(ROUTER_NUMBAI);

    console.log("Receiver contract deployed to:", receiver.target);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/**
Command: npx hardhat run scripts/deployReceiverChainlink.ts --network mumbai
Deploying contracts with the account: 0xe2177DFeE5751858D820425D73aEFB604d1AaB07
Receiver contract deployed to: 0x427923a7755f3e17253f9cC4523D88a6A981928C

/args: 1 = contract address, 2 = router address
Verify contract: npx hardhat verify --network mumbai 0x427923a7755f3e17253f9cC4523D88a6A981928C "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1"
 */