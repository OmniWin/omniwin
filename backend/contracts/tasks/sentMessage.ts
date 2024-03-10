import { HardhatUserConfig, task, types } from "hardhat/config";

task("sendMessage", "Sends a message from Sepolia to Mumbai")
    .setAction(async (taskArgs, hre) => {
        const DEPLOYED_SENDER_CONTRACT_ADDRESS_ON_SEPOLIA = "0x27a709050314A7eb2546d48d64C3855d7717e2cd";
        const senderContractAddress = DEPLOYED_SENDER_CONTRACT_ADDRESS_ON_SEPOLIA;

        // Ensure you have the correct recipient address on the destination chain (Mumbai)
        const recipientContractOnMumbai = "0xdC20CcDb1F2AEFBC56B3741d0cBDe1c7A7c3C9E0";
        const messageToSend = "Sok!";

        // Get the contract factory and attach it to the deployed address
        const SenderContract = await hre.ethers.getContractAt("SenderContract", senderContractAddress);


        // Set the recipient address (only necessary if it changes or hasn't been set)
        await SenderContract.setRecipient(recipientContractOnMumbai);

        // Convert your message to bytes if necessary 
        const messageBytes = hre.ethers.toUtf8Bytes(messageToSend);

        const fee = await SenderContract.estimateFees(messageBytes);

        console.log(`Estimated fee: ${fee}`);

        // Send the message
        const transactionResponse = await SenderContract.sendMessage(messageBytes, { value: fee });
        await transactionResponse.wait();

        console.log(`Message sent successfully: ${messageToSend}`);

    });
