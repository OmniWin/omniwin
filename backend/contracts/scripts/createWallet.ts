import { ethers } from 'ethers';

async function createWallet() {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();

    // Print out the private key and address (make sure to keep the private key secure)
    console.log('Private Key:', wallet.privateKey);
    console.log('Address:', wallet.address);
}

createWallet();