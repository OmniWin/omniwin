import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Omniwin", function () {
    async function deployNftContract() {
        const nft = await ethers.deployContract("OmniwinNFT721");
        await nft.waitForDeployment();

        return nft;
    }

    async function deployERC20Contract() {
        const erc20 = await ethers.deployContract("OmniwinERC20");
        await erc20.waitForDeployment();

        return erc20;
    }

    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const ONE_GWEI = 1_000_000_000;

        // Deploy NFT contract
        const nft = await deployNftContract();
        console.log("NFT721 deployed to:", nft.target);

        // Deploy ERC20 contract
        const erc20 = await deployERC20Contract();
        console.log("ERC20 deployed to:", erc20.target);


        //Sepolia
        const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
        const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
        const linkContract = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
        const mainnet = false;

        // Contracts are deployed using the first signer/account by default
        const omniwin = await ethers.deployContract("Omniwin", [vrfCoordinator, linkContract, keyHash, mainnet]);
        await omniwin.waitForDeployment();

        console.log("Omniwin deployed to:", omniwin.target, "with owner:", owner.address);
        return { omniwin, nft, erc20, owner, otherAccount };
    }

    it("Should assign the DEFAULT_ADMIN_ROLE to the owner", async function () {
        const { omniwin, owner } = await loadFixture(deployContract);
        const DEFAULT_ADMIN_ROLE = await omniwin.DEFAULT_ADMIN_ROLE();

        expect(await omniwin.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });


    it("Should mint NFT and transfer to other account", async function () {
        const { omniwin, nft, owner, otherAccount } = await loadFixture(deployContract);
        const tokenId = 1;
        await nft.mintCollectionNFT(owner.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
        await nft.transferFrom(owner.address, otherAccount.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);
    })

    it("Should mint ERC20 and transfer to other account", async function () {
        const { omniwin, erc20, owner, otherAccount } = await loadFixture(deployContract);
        const amount = 100;
        await erc20.transfer(otherAccount.address, amount);
        expect(await erc20.balanceOf(otherAccount.address)).to.equal(amount);
    })

    // it("Should create a new raffle with NFT as prize", async function () {
    //     const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);
    //     const amount = 100;
    //     const desiredFundsInWeis = ethers.parseEther("10");
    //     const minimumFundsInWeis = ethers.parseEther("1");
    //     const commissionInBasicPoints = 500; // 5% for simplicity
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const prizeAddress = nft.target; // NFT contract address - this is the contracts address
    //     const prizeNumber = 1; // NFT tokenId

    //     // Mint an NFT for the prize and transfer some ERC20 tokens as potential prize or for setup
    //     await nft.mintCollectionNFT(owner.address, prizeNumber);
    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             id: 0,
    //             numEntries: 1,
    //             price: ethers.parseEther("0.01"),
    //         },
    //         {
    //             id: 1,
    //             numEntries: 5,
    //             price: ethers.parseEther("0.045"), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.createRaffle(
    //         desiredFundsInWeis,
    //         prizeAddress,
    //         prizeNumber,
    //         minimumFundsInWeis,
    //         prices,
    //         commissionInBasicPoints,
    //         entryType
    //     );
    //     const receipt = await tx.wait();

    //     const raffleId = 0;
    //     await expect(receipt).to.emit(omniwin, "RaffleCreated").withArgs(raffleId, prizeAddress, prizeNumber);
    // });

    it("Should create a new raffle with ERC20 as prize", async function () {
        const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

        const desiredFundsInWeis = ethers.parseEther("10");
        const minimumFundsInWeis = ethers.parseEther("1");
        const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
        const assetType = 0; // ERC20 token, adjust based on enum order
        const prizeAddress = erc20.target; // Token contract
        const prizeAmount = 1000; // Number of tokens to be used as the prize
        const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

        // Step 1: Transfer tokens to `otherAccount` to be used as the prize
        const amount = 10000;
        await erc20.transfer(otherAccount.address, amount);

        // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
        await erc20.connect(otherAccount).approve(omniwin.target, prizeAmount);

        // Check allowance
        const allowance = await erc20.allowance(otherAccount.address, omniwin.target);
        console.log("Allowance:", allowance.toString());

        // Check balance
        const balance = await erc20.balanceOf(otherAccount.address);
        console.log("Balance:", balance.toString());

        // Define prices for entries into the raffle
        const prices = [
            {
                id: 0,
                numEntries: 1,
                price: ethers.parseEther("0.01"),
            },
            {
                id: 1,
                numEntries: 5,
                price: ethers.parseEther("0.045"), // Slight discount for buying more
            },
        ];

        // Call createRaffle with the defined parameters
        const tx = await omniwin.connect(otherAccount).createRaffle(
            desiredFundsInWeis,
            prizeAddress,
            prizeAmount,
            minimumFundsInWeis,
            prices,
            entryType,
            assetType,
            deadlineDuration
        );

        const raffleId = 0;
        await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
    });

    it("Should fail if amount raised is below minimum amount and deadline has passed", async function () {
        const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

        const raffleId = 0;
        const desiredFundsInWeis = ethers.parseEther("10");
        const minimumFundsInWeis = ethers.parseEther("100");
        const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
        const assetType = 0; // ERC20 token, adjust based on enum order
        const prizeAddress = erc20.target; // Token contract
        const prizeAmount = 1000; // Number of tokens to be used as the prize
        const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

        // Step 1: Transfer tokens to `otherAccount` to be used as the prize
        const amount = 10000;
        await erc20.transfer(otherAccount.address, amount);

        // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
        await erc20.connect(otherAccount).approve(omniwin.target, prizeAmount);

        // Define prices for entries into the raffle
        const prices = [
            {
                id: 0,
                numEntries: 1,
                price: ethers.parseEther("0.01"),
            },
            {
                id: 1,
                numEntries: 5,
                price: ethers.parseEther("0.045"), // Slight discount for buying more
            },
        ];

        // Call createRaffle with the defined parameters
        const tx = await omniwin.connect(otherAccount).createRaffle(
            desiredFundsInWeis,
            prizeAddress,
            prizeAmount,
            minimumFundsInWeis,
            prices,
            entryType,
            assetType,
            deadlineDuration
        );

        //buy some tickets
        await omniwin.connect(otherAccount).buyEntry(raffleId, 1, { value: prices[1].price });

        //check bought tickets
        const entryIndex = 1;
        const tickets = await omniwin.entriesList(raffleId, entryIndex);
        console.log("Tickets:", tickets);


        await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

        // Wait for the deadline to pass
        await time.increase(deadlineDuration + 1);

        // claim refund
        await expect(await omniwin.connect(otherAccount).claimRefund(raffleId)).to.be.revertedWith("No refund available");
    });
});