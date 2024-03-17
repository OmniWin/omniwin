import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import exp from "constants";
import {routerConfig} from "../constants/constants"
enum ASSET_TYPE {
    ERC20,
    ERC721,
    ETH,
    CCIP
}

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

    async function deployUSDCContract() {
        const usdc = await ethers.deployContract("USDC");
        await usdc.waitForDeployment();

        return usdc;
    }

    async function deployMockCCIPRouter() {
        const MockRouterClient = await ethers.deployContract("MockCCIPRouter");
        await MockRouterClient.waitForDeployment();

        return MockRouterClient;
    }

    async function deployMockLinkToken() {
        const MockLinkToken = await ethers.deployContract("MockLinkToken");
        await MockLinkToken.waitForDeployment();

        return MockLinkToken;
    }


    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const ONE_GWEI = 1_000_000_000;

        // Deploy NFT contract
        const nft = await deployNftContract();
        expect(nft).to.exist;
        console.log("NFT721 deployed to:", nft.target);

        // Deploy ERC20 contract
        const erc20 = await deployERC20Contract();
        console.log("ERC20 deployed to:", erc20.target);
        expect(erc20).to.exist;

        // Deploy USDC contract
        const usdc = await deployUSDCContract();
        console.log("USDC deployed to:", usdc.target);
        expect(usdc).to.exist;

        //mint some USDC
        const mintAmount = 1000000000;
        await usdc.mint(owner.address, mintAmount);
        const usdcBalance = await usdc.balanceOf(owner.address);
        expect(usdcBalance).to.equal(mintAmount);

        const MockRouterClient = await deployMockCCIPRouter();
        const MockLinkToken = await deployMockLinkToken();


        const vrfCoordinatorBNB = routerConfig.bnbChainTestnet.vrfCoordinator;
        const linkTokenBNB =  routerConfig.bnbChainTestnet.feeTokens[0];
        const keyHashBNB = routerConfig.bnbChainTestnet.keyHash;
        const mainnetBNB = false;
        const routerBNB = routerConfig.bnbChainTestnet.address;

        const omniwinMain = await ethers.deployContract("Omniwin", [vrfCoordinatorBNB, MockLinkToken, keyHashBNB, mainnetBNB, MockRouterClient.target]);
        await omniwinMain.waitForDeployment();

        

        await omniwinMain.setUSDCTokenAddress(usdc.target);

        //check if usdc address is set
        const usdcAddressBNB = await omniwinMain.usdcContractAddress();
        expect(usdcAddressBNB).to.equal(usdc.target);

        //Deploy sidechain contract on Sepolia
        const routerSepolia = routerConfig.ethereumSepolia.address;
        const linkSepolia = routerConfig.ethereumSepolia.feeTokens[0];

        // Contracts are deployed using the first signer/account by default
        const omniwinSide = await ethers.deployContract("OmniwinSide", [MockRouterClient.target, MockLinkToken]);
        await omniwinSide.waitForDeployment();

        //Set Receiver for bnb chain to be omniwin sidechain
        await omniwinMain.setChainSelectorReceiver(routerConfig.bnbChainTestnet.chainSelector, omniwinSide.target);

        await omniwinSide.setUSDCTokenAddress(usdc.target);

        //check if usdc address is set
        const usdcAddress = await omniwinSide.usdcContractAddress();
        expect(usdcAddress).to.equal(usdc.target);

        console.log("Omniwin Mainchain deployed to:", omniwinMain.target, "with owner:", owner.address);
        console.log("Omniwin Sidechain deployed to:", omniwinSide.target, "with owner:", owner.address);
        return { omniwinMain, omniwinSide, MockRouterClient, nft, erc20, usdc, owner, otherAccount };
    }

    it("Should assign the DEFAULT_ADMIN_ROLE to the owner", async function () {
        const { omniwinMain, owner } = await loadFixture(deployContract);
        const DEFAULT_ADMIN_ROLE = await omniwinMain.DEFAULT_ADMIN_ROLE();

        expect(await omniwinMain.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });


    it("Should mint NFT and transfer to other account", async function () {
        const { omniwinSide, nft, owner, otherAccount } = await loadFixture(deployContract);
        const tokenId = 1;
        await nft.mintCollectionNFT(owner.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
        await nft.transferFrom(owner.address, otherAccount.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);
    })

    it("Should mint ERC20 and transfer to other account", async function () {
        const { omniwinSide, erc20, owner, otherAccount } = await loadFixture(deployContract);
        const amount = 100;
        await erc20.transfer(otherAccount.address, amount);
        expect(await erc20.balanceOf(otherAccount.address)).to.equal(amount);
    })

    it("Should create a new raffle with ERC20 as prize main contract and create raffle on sidechain", async function () {
        const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

        const minimumFundsInWeis = ethers.parseEther("1");
        const assetType = 0; // ERC20 token, adjust based on enum order
        const prizeAddress = erc20.target; // Token contract
        const prizeAmount = 1000; // Number of tokens to be used as the prize
        const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

        //he have a mapping in main contract (chainSelector => contractAddress). We map each chainSelector(id we get from chainlink docs) to our deployed contracts for each chain
        const chainSelectors = [routerConfig.bnbChainTestnet.chainSelector]; //create raffle on BNBTestnet also

        // Step 1: Transfer tokens to `otherAccount` to be used as the prize
        const amount = 10000;
        await erc20.transfer(otherAccount.address, amount);

        // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
        await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

        // Check allowance
        const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
        expect(allowance).to.equal(prizeAmount);

        // Check balance
        const balance = await erc20.balanceOf(otherAccount.address);
        expect(balance).to.equal(amount);

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
        const tx = await omniwinMain.connect(otherAccount).createRaffle(
            prizeAddress,
            prizeAmount,
            minimumFundsInWeis,
            prices,
            assetType,
            deadlineDuration,
            chainSelectors
        );

        const raffleId = 0;
        await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

        // Assuming you know the chain selectors and the expected message IDs for each
        for (let i = 0; i < chainSelectors.length; i++) {
            await expect(tx)
            .to.emit(omniwinMain, 'CreateRaffleToSidechain')
        }

        // check if raffle is created on sidechain
        const raffle = await omniwinSide.raffles(raffleId)
        expect(raffle).to.exist;

        expect(raffle.prizeNumber).to.equal(0);
        expect(raffle.assetType).to.equal(ASSET_TYPE.CCIP);

        const priceIndex = 1;
        const pricesSidechain = await omniwinSide.pricesList(raffleId,priceIndex);
        expect(pricesSidechain.price).to.equal(prices[priceIndex].price);

    });

    describe("Raffle functionality", function () {
        beforeEach(async function () {
            // Load the initial setup fixture
            const { omniwinMain,omniwinSide,usdc, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);
  
            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            const chainSelectors = [routerConfig.bnbChainTestnet.chainSelector]; //create raffle on BNBTestnet also

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 100 * 10 ** 6;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 2,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                chainSelectors
            );


            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const initialBalance = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
            expect(initialBalance).to.be.equal(mintAmount);
            
            // Extend this object with more properties as needed by tests
            this.testContext = { omniwinMain, omniwinSide,usdc, erc20, otherAccount };
        });

        it("Should allow buying tickets on both main and side chains", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount } = this.testContext;
            const raffleId = 0;
            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
            const numEntries = prices.numEntries;

            console.log(otherAccount.address,"Buying: ", numEntries, " entries for ", price, " USDC");
            
            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            
            // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
            await buyTx1.wait();



            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2, price2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);

            console.log("Tickets bought: ", tickets);
            expect(tickets).to.exist;

            // B. Buy tickets on side chain
            
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price);

            // Buy entry type 1
            const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
            await buyTx1Side.wait();

            //check bought tickets
            // const ticketsSide = await omniwinSide.entriesList(raffleId,0);
            // console.log("Tickets bought on sidechain: ", ticketsSide);
        });
    });
    // it("Should claim full refund for all bought tickets", async function () {
    //     const { omniwin, nft, erc20, owner, usdc, otherAccount } = await loadFixture(deployContract);

    //     const raffleId = 0;
    //     const minimumFundsInWeis = ethers.parseEther("100");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 0; // ERC20 token, adjust based on enum order
    //     const prizeAddress = erc20.target; // Token contract
    //     const prizeAmount = 1000; // Number of tokens to be used as the prize
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Transfer tokens to `otherAccount` to be used as the prize
    //     const amount = 10000;
    //     await erc20.transfer(otherAccount.address, amount);

    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await erc20.connect(otherAccount).approve(omniwin.target, prizeAmount);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6), // Convert $10 to smallest unit as BigInt
    //         },
    //         {
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Convert $100 to smallest unit as BigInt
    //         },
    //         {
    //             numEntries: 250,
    //             price: ethers.parseUnits("1000", 6), // Convert $1000 to smallest unit as BigInt
    //         },
    //     ];
    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         prizeAmount,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     //mint some USDC
    //     const mintAmount = ethers.parseUnits("2000", 6);
    //     await usdc.mint(otherAccount, mintAmount);

    //     const initialBalance = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(initialBalance).to.be.equal(mintAmount);

    //     //give allowance to omniwin
    //     await usdc.connect(otherAccount).approve(omniwin.target, mintAmount);
    //     expect(await usdc.allowance(otherAccount.address, omniwin.target)).to.be.equal(mintAmount);

    //     // Buy entry type 1 (single entry)
    //     const buyTx1 = await omniwin.connect(otherAccount).buyEntry(raffleId, 0, prices[0].price);
    //     await buyTx1.wait();

    //     // Buy entry type 2 (multiple entries)
    //     const buyTx2 = await omniwin.connect(otherAccount).buyEntry(raffleId, 2, prices[2].price);
    //     await buyTx2.wait();


    //     //check bought tickets
    //     const tickets = await omniwin.getRafflesEntryInfo(raffleId);
    //     expect(tickets).to.exist;

    //     // Wait for the deadline to pass
    //     await time.increase(deadlineDuration + 1);

    //     //check usdc balance of otherAccount
    //     const balanceAfterTicketBuy = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterTicketBuy).to.be.equal(initialBalance - prices[0].price - prices[2].price);

    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

    //     const totalTicketCost = prices[0].price + prices[2].price;

    //     const expectedBalanceAfterRefund = balanceAfterTicketBuy + totalTicketCost;

    //     // // claim refund
    //     await omniwin.connect(otherAccount).claimRefund(raffleId)
    //     const balanceAfterRefund = await usdc.connect(otherAccount).balanceOf(otherAccount.address);

    //     expect(balanceAfterRefund).to.be.equal(expectedBalanceAfterRefund);
    // });


    // it("Should create raffle with ERC721 as prize", async function () {
    //     const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

    //     const minimumFundsInWeis = ethers.parseEther("1");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);


    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Check balance
    //     const balance = await nft.balanceOf(otherAccount.address);
    //     expect(balance).to.equal(1);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             id: 0,
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6),
    //         },
    //         {
    //             id: 1,
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     const raffleId = 0;
    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);
    // })

    // it("Should claim full refund for all bought tickets and nft reclaim", async function () {
    //     const { omniwin, nft, erc20, usdc, owner, otherAccount } = await loadFixture(deployContract);

    //     const raffleId = 0;
    //     const minimumFundsInWeis = ethers.parseEther("100");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);

    //     //check nft balance of otherAccount
    //     const balanceAfterNftTransfer = await nft.balanceOf(otherAccount.address);
    //     expect(balanceAfterNftTransfer).to.equal(1);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId).to.equal(otherAccount.address);

    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6),
    //         },
    //         {
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Slight discount for buying more
    //         },
    //         {
    //             numEntries: 250,
    //             price: ethers.parseUnits("1000", 6), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId2 = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId2).to.equal(omniwin.target);

    //     const nftBalanceAfterRaffleCreation = await nft.balanceOf(otherAccount.address);
    //     expect(nftBalanceAfterRaffleCreation).to.equal(0);

    //     //mint some USDC
    //     const mintAmount = ethers.parseUnits("2000", 6);
    //     await usdc.mint(otherAccount, mintAmount);

    //     const initialBalance = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(initialBalance).to.be.equal(mintAmount);

    //     //give allowance to omniwin
    //     await usdc.connect(otherAccount).approve(omniwin.target, mintAmount);
    //     expect(await usdc.allowance(otherAccount.address, omniwin.target)).to.be.equal(mintAmount);

    //     // Buy entry type 1
    //     await omniwin.connect(otherAccount).buyEntry(raffleId, 0, prices[0].price);

    //     // Buy entry type 2
    //     await omniwin.connect(otherAccount).buyEntry(raffleId, 2, prices[2].price);

    //     //check bought tickets
    //     const tickets = await omniwin.getRafflesEntryInfo(raffleId);
    //     expect(tickets).to.exist;

    //     // Wait for the deadline to pass
    //     await time.increase(deadlineDuration + 1);

    //     //check usdc balance of otherAccount
    //     const balanceAfterTicketBuy = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterTicketBuy).to.be.equal(initialBalance - prices[0].price - prices[2].price);

    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

    //     const totalTicketCost = prices[0].price + prices[2].price;

    //     const expectedBalanceAfterRefund = balanceAfterTicketBuy + totalTicketCost;

    //     // claim refund for all tickets
    //     await omniwin.connect(otherAccount).claimRefund(raffleId)

    //     const balanceAfterRefund = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterRefund).to.be.equal(expectedBalanceAfterRefund);

    //     //reclaim nft
    //     await omniwin.connect(otherAccount).reclaimAssets(raffleId)

    //     // Check NFT balance after reclaiming
    //     const finalNftBalance = await nft.balanceOf(otherAccount.address);
    //     expect(finalNftBalance).to.equal(1);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId3 = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId3).to.equal(otherAccount.address);

    // });


    // it("Should cancel raffle", async function () {
    //     const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

    //     const minimumFundsInWeis = ethers.parseEther("1");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);


    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Check balance
    //     const balance = await nft.balanceOf(otherAccount.address);
    //     expect(balance).to.equal(1);

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
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     const raffleId = 0;
    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

    //     //cancel raffle
    //     await omniwin.cancelRaffle(raffleId);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId).to.equal(otherAccount.address);
    // });
});