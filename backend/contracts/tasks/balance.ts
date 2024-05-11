import { task } from "hardhat/config";
import { ethers } from "ethers";
import { networkConfig } from "../helper-hardhat-config";

task("balance", "Prints an account's balances of native and LINK tokens")
    .addParam("account", "The account's address")
    .addOptionalParam("linkaddress", "Set the LINK token address")
    .setAction(async ({ account, linkaddress }, { ethers, network }) => {
        const accounts = await ethers.getSigners();
        const signer = accounts[0];

        const normalizedAccount = ethers.getAddress(account);
        const networkId = network.config.chainId?.toString() || "11155111";
        const provider = signer.provider;

        // native token balance
        const balance = await provider.getBalance(normalizedAccount);

        // fetch LINK token balance
        const linkTokenAddress = networkConfig[networkId]?.linkToken || linkaddress;

        if (!linkTokenAddress) {
            console.log("LINK token address is not provided or not found in network config.");
            return;
        }

        const linkTokenContract = new ethers.Contract(linkTokenAddress, [
            // ABI for the balanceOf function
            "function balanceOf(address owner) external view returns (uint256)"
        ], signer);
        const linkBalance = await linkTokenContract.balanceOf(normalizedAccount);

        console.log(ethers.formatEther(balance), "ETH");
        console.log(ethers.formatEther(linkBalance), "LINK");
    });
