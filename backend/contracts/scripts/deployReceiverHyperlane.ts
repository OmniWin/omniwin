import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ReceiverContract = await ethers.getContractFactory("ReceiverContract");
    const receiver = await ReceiverContract.deploy();

    console.log("Receiver contract deployed to:", receiver.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

/**
Deploying contracts with the account: 0xe2177DFeE5751858D820425D73aEFB604d1AaB07
Receiver contract deployed to: 0xdC20CcDb1F2AEFBC56B3741d0cBDe1c7A7c3C9E0
 */