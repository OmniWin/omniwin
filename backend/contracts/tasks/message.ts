import {
    chainMetadata,
    ChainName,
    MultiProvider
} from "@hyperlane-xyz/sdk";
import { HardhatUserConfig, task, types } from "hardhat/config";
import { ethers } from "ethers";
import { networkConfig } from "../helper-hardhat-config";

const accounts = ["0x77da3e987535afe6945c020b2f9031919932d74d60840d6eb864ae20b6794e4a"]; //private key

const multiProvider = new MultiProvider();

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
    .addParam(
        "remote",
        "The name of the destination chain of this message",
        undefined,
        types.string,
        false
    )
    .addParam("message", "the message you want to send", "Hello World")
    .setAction(async (taskArgs, hre) => {
        const privateKey = "0x77da3e987535afe6945c020b2f9031919932d74d60840d6eb864ae20b6794e4a"; // Replace with the actual private key
        const provider = hre.ethers.provider;
        const signer = new ethers.Wallet(privateKey, provider);

        const recipient = "0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35";
        const origin = hre.network.name as ChainName;
        const remote = taskArgs.remote as ChainName;
        // const remoteDomain = multiProvider.getDomainId(remote);
        const remoteDomain = "11155111"; // SEPOLIA
        // const outboxC = HyperlaneCoreAddresses[origin].mailbox;
        const outboxC = "0xeDc1A3EDf87187085A3ABb7A9a65E1e7aE370C07"; // TEST RECIPIENT SEPOLIA
        const igpAddress = "0xF45A4D54223DA32bf7b5D43a9a460Ef3C94C713B";

        const outbox = new hre.ethers.Contract(outboxC, MAILBOX_ABI, signer);
        console.log(
            `Sending message "${taskArgs.message}" from ${hre.network.name} to ${taskArgs.remote}`
        );

        const tx = await outbox.dispatch(
            remoteDomain,
            ethers.zeroPadValue(recipient, 32),
            //   utils.addressToBytes32(recipient),
            hre.ethers.getBytes(hre.ethers.toUtf8Bytes(taskArgs.message))
        );

        const receipt = await tx.wait();
        console.log(
            `Send message at txHash ${tx.hash}. Check the explorer at https://explorer.hyperlane.xyz/?search=${tx.hash}`
        );

        console.log(
            "Pay for processing of the message via the InterchainGasPaymaster"
        );
        const messageId = getMessageIdFromDispatchLogs(receipt.logs);

        const igp = new hre.ethers.Contract(
            igpAddress,
            INTERCHAIN_GAS_PAYMASTER_ABI,
            signer
        );
        const gasPayment = await igp.quoteGasPayment(
            remoteDomain,
            DESTINATIONGASAMOUNT
        );
        const igpTx = await igp.payForGas(
            messageId,
            remoteDomain,
            DESTINATIONGASAMOUNT,
            await signer.getAddress(),
            { value: gasPayment }
        );
        await igpTx.wait();

        const recipientUrl = await multiProvider.tryGetExplorerAddressUrl(
            remote,
            recipient
        );
        console.log(
            `Check out the explorer page for recipient ${recipientUrl}#events`
        );
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