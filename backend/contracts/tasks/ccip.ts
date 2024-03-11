import { HardhatUserConfig, task, types } from "hardhat/config";
import {routerConfig} from "../constants/constants";
import { Spinner } from "../utils/spinner";
import { getPayFeesIn } from "../utils/payFeesIn";

task("ccip", "Sends a message from Sepolia to Mumbai")
    .setAction(async (taskArgs, hre) => {
        const spinner: Spinner = new Spinner();

        // Ensure you have the correct recipient address on the destination chain (Mumbai)
        const RECEIVER_CONTRACT = "0x427923a7755f3e17253f9cC4523D88a6A981928C";
        const deployedAddress = "0x20E80C8CAd2559bF342F58B877041F04C9a85038"; //Contract deployed on sepolia

        // Get the contract factory and attach it to the deployed address
        const SenderContract = await hre.ethers.getContractAt("CCIPSender", deployedAddress);
        const message = "Hello Mumbai";
        const sourceBlockchain = "Sepolia";
        const destinationBlockchain = "Mumbai";

        try{
            console.log(`ℹ️  Attempting to send the ${message} message from the sender smart contract (${deployedAddress}) on the ${sourceBlockchain} blockchain to the BasiceMessageReceiver smart contract (${RECEIVER_CONTRACT} on the ${destinationBlockchain} blockchain)`);
            const fees = getPayFeesIn('LINK');

            spinner.start();

            console.log(`Sending message: ${routerConfig.polygonMumbai.chainSelector}`, RECEIVER_CONTRACT, message, fees);

            const tx = await SenderContract.send(
                routerConfig.polygonMumbai.chainSelector,
                RECEIVER_CONTRACT,
                message,
                fees
            )
            
            await tx.wait();

            spinner.stop();

            console.log(`Message sent successfully: Hello Mumbai`);
            console.log(`Transaction hash: ${tx.hash}`);

        }catch(e){
            console.log(e);
            //ProviderError: execution reverted: ERC20: transfer amount exceeds balance = Insufficient LINK balance
        }
       

    });
