import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const SenderContract = await ethers.getContractFactory("SenderContract");
    const DESTINATION_DOMAIN_ID_FOR_MUMBAI = 80001;
    const OUTBOX_ADDRESS_ON_SEPOLIA = "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766";

    /**
In a cross-chain communication setup using Hyperlane, when deploying a Sender contract that initiates messages, you typically specify the address of the Outbox contract on the origin chain. The Outbox is responsible for handling the dispatch of messages from the origin chain to a destination chain.

So, in your scenario, where you're sending from Sepolia to Mumbai, the OUTBOX_ADDRESS_ON_SEPOLIA refers to the Outbox contract's address on Sepolia because Sepolia is the origin chain from where you're sending the message. This is why in the deployment script for the Sender contract, you use the Outbox address from Sepolia, not Mumbai.

The DESTINATION_DOMAIN_ID_FOR_MUMBAI would be used to specify to the Outbox contract on Sepolia that the intended destination for the message is Mumbai. This domain ID helps the Hyperlane network route the message correctly from Sepolia to the destination chain, which is Mumbai in this case.
     */
    const sender = await SenderContract.deploy(OUTBOX_ADDRESS_ON_SEPOLIA, DESTINATION_DOMAIN_ID_FOR_MUMBAI);

    console.log("Sender contract deployed to:", sender.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


/**
Deploying contracts with the account: 0x6Ee234184880D8C6Eda599A0aB0FB678b7de8809
Sender contract deployed to: 0x27a709050314A7eb2546d48d64C3855d7717e2cd
 */