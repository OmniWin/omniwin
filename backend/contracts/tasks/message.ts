import {
    chainMetadata,
    ChainName,
    MultiProvider,
    HyperlaneCore,
} from "@hyperlane-xyz/sdk";
import { HardhatUserConfig, task, types } from "hardhat/config";
import { ethers } from "ethers";
import { networkConfig } from "../helper-hardhat-config";
import { addressToBytes32 } from '@hyperlane-xyz/utils';


const accounts = ["0x77da3e987535afe6945c020b2f9031919932d74d60840d6eb864ae20b6794e4a"]; //private key


const MAILBOX_ABI = [
    "function dispatch(uint32 destinationDomain, bytes32 recipient, bytes calldata message) returns (bytes32)",
    "event DispatchId(bytes32 indexed messageId)",
];

const INTERCHAIN_GAS_PAYMASTER_ABI = [
    "function payForGas(bytes32 _messageId, uint32 _destinationDomain, uint256 _gasAmount, address _refundAddress) payable",
    "function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount) public view returns (uint256)",
];
const INTERCHAIN_ACCOUNT_ROUTER_ABI = [
    "function dispatch(uint32 _destinationDomain, (address, bytes)[] calldata calls)",
];
const TESTRECIPIENT_ABI = [
    "function fooBar(uint256 amount, string calldata message)",
];

const INTERCHAIN_ACCOUNT_ROUTER = "0xc61Bbf8eAb0b748Ecb532A7ffC49Ab7ca6D3a39D";
const INTERCHAIN_QUERY_ROUTER = "0x6141e7E7fA2c1beB8be030B0a7DB4b8A10c7c3cd";

// A global constant for simplicity
// This is the amount of gas you will be paying for for processing of a message on the destination
const DESTINATIONGASAMOUNT = 1000000;

task("send-message", "sends a message")
    .addParam('message', 'The message you want to send', 'Hello World', types.string)
    .addOptionalParam('origin', 'The name of the origin chain', undefined, types.string)
    .addOptionalParam('destination', 'The name of the destination chain', undefined, types.string)
    .setAction(async ({ message, origin = 'sepolia', destination = 'mumbai' }, { ethers }) => {

        const multiProvider = new MultiProvider();
        const privateKey = "0x77da3e987535afe6945c020b2f9031919932d74d60840d6eb864ae20b6794e4a";
        const signer = new ethers.Wallet(privateKey, ethers.provider);

        // Ensure origin and destination are set correctly
        if (!origin || !destination) {
            console.error('Origin and destination chains must be specified');
            return;
        }

        const recipient = "0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35";
        const originChain = origin as ChainName;
        const destinationChain = destination as ChainName;


        // Initialize Hyperlane Core with the addresses from your configuration
        const core = new HyperlaneCore(networkConfig, multiProvider);

        // Construct the message and recipient details
        const messageBody = ethers.toUtf8Bytes(message);
        const destinationDomainId = multiProvider.getDomainId(destinationChain);
        const recipientAddress = networkConfig[destinationChain].testRecipient; // Ensure you have this configured
        const recipientBytes32 = addressToBytes32(recipientAddress);

        // Send the message
        try {
            console.log(`Sending message from ${originChain} to ${destinationChain}`);

            // Assuming the mailbox contract is already set in your network configuration
            const mailbox = core.getContracts(originChain).mailbox;
            const value = await mailbox.quoteDispatch(
                destinationDomainId,
                recipientBytes32,
                messageBody,
                ethers.hexlify([]), // Additional data if needed
                '0x' // Hook address if used; otherwise, pass an empty hex string
            );

            console.log(`Estimated gas payment: ${ethers.formatEther(value)} ETH`);

            const dispatchTx = await mailbox.dispatch(
                destinationDomainId,
                recipientBytes32,
                messageBody,
                ethers.hexlify([]), // Additional data if needed
                '0x', // Hook address if used; otherwise, pass an empty hex string
                { value }
            );

            console.log(`Message dispatched: ${dispatchTx.hash}`);
            await dispatchTx.wait();
            console.log('Message successfully sent and waiting for delivery.');
        } catch (error) {
            console.error(`Failed to send message: ${error}`);
        }


    });


function getMessageIdFromDispatchLogs(logs: Log[]) {
    const mailboxInterface = new ethers.Interface(MAILBOX_ABI);
    for (const log of logs) {
        try {
            const parsedLog = mailboxInterface.parseLog(log);
            if (parsedLog.name === "DispatchId") {
                return parsedLog.args.messageId;
            }
        } catch (e) { }
    }
    return undefined;
}