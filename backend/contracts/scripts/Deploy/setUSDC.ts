import { ethers } from "hardhat";

async function main() {
    // Process command line arguments
    const contractAddress = process.argv[2];
    const usdcTokenAddress = process.argv[3];

    if (!contractAddress || !usdcTokenAddress) {
        console.error("Usage: npx hardhat run deployUSDC.ts --network bscTestnet <contractAddress> <usdcTokenAddress>");
        return;
    }

    console.log('Contract address:', contractAddress);
    console.log('USDC Token address:', usdcTokenAddress);

    const abi = [
        "function setUSDCTokenAddress(address _usdcContractAddress)"
    ];


    // Create a connection to the network and a contract instance
    const [signer] = await ethers.getSigners(); // Get signer information
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const txResponse = await contract.setUSDCTokenAddress(usdcTokenAddress); // Replace with actual USDC contract address
    await txResponse.wait(); // Wait for the transaction to be mined

    console.log('Transaction successful:', txResponse.hash);

    
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
