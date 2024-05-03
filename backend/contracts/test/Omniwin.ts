//https://blog.openzeppelin.com/introducing-openzeppelin-defender-2-0
import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {routerConfig} from "../constants/constants"
import { omniwinMainSol } from "../typechain-types/contracts/mainChain";
import exp from "constants";
import { calcFunctionSignature } from "../utils/funcSignature";
enum ASSET_TYPE {
    ERC20,
    ERC721,
    ETH,
    CCIP
}

const ccipMessageFee = BigInt(500000); // 50c USDC

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

    async function deployVrfCoordinator(MockLinkToken: any) {
        // const baseFee = 0.1 * 10 ** 18;
        const baseFee = BigInt("100000000000000000");
        //It's used to calculate the variable part of the fee for a VRF request, which depends on the amount of gas used by the callback function in your contract (the function that receives and processes the random numbers).
        const gasPriceLink = 1000000000; //1e9; //1e9 = 0.000000001 LINK per gas
        const VrfCoordinator = await ethers.deployContract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink]);
        await VrfCoordinator.waitForDeployment();

        const tx = await VrfCoordinator.createSubscription();
        await tx.wait(); // Wait for the transaction to be mined

        // Fetch the transaction receipt to access the event logs
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

        // Assuming the event is called "SubscriptionCreated" and it's the first event
        const subIdEvent = receipt?.logs.map(log => VrfCoordinator.interface.parseLog(log))
                                        .find(log => log?.name === "SubscriptionCreated");

        const subId = subIdEvent?.args.subId

        console.log("Subscription ID:", subId);
        VrfCoordinator.fundSubscription(subId, BigInt("1000000000000000000"));

        return VrfCoordinator;
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

        const MockLinkToken = await deployMockLinkToken();
        console.log("MockLinkToken deployed to:", MockLinkToken.target);
        expect(MockLinkToken).to.exist;

        // Deploy VRF Coordinator
        const vrfCoordinator = await deployVrfCoordinator(MockLinkToken);
        console.log("VRF Coordinator deployed to:", vrfCoordinator.target);
        expect(vrfCoordinator).to.exist;
  

        //mint some USDC
        const mintAmount = 1000000000;
        await usdc.mint(owner.address, mintAmount);
        const usdcBalance = await usdc.balanceOf(owner.address);
        expect(usdcBalance).to.equal(mintAmount);

        const MockRouterClient = await deployMockCCIPRouter();
        console.log("MockRouterClient deployed to:", MockRouterClient.target);
        
        const subscriptionId = BigInt(1);

        const vrfCoordinatorBNB = routerConfig.bnbChainTestnet.vrfCoordinator;
        const linkTokenBNB =  routerConfig.bnbChainTestnet.feeTokens[0];
        const keyHashBNB = routerConfig.bnbChainTestnet.keyHash;
        const mainnetBNB = false;
        const routerBNB = routerConfig.bnbChainTestnet.address;

        const omniwinMain = await ethers.deployContract("Omniwin", [vrfCoordinator, MockLinkToken, keyHashBNB, mainnetBNB, MockRouterClient.target,subscriptionId]);
        await omniwinMain.waitForDeployment();
        console.log("Main contract deployed to:", await omniwinMain.getAddress());

          //Adding the consumer contract to the subscription
        //Only owner of subscription can add consumers
        await vrfCoordinator.addConsumer(subscriptionId, omniwinMain.target);
        //fulfillrandomwords
        // await vrfCoordinator.connect(owner).fulfillRandomWords(1, omniwinMain.target);


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

        await omniwinSide.setUSDCTokenAddress(usdc.target);
        await omniwinSide.setMainChainSelector(routerConfig.bnbChainTestnet.chainSelector); // assuming main chain will be on bnb chain
        await omniwinSide.setMainChainRaffleAddress(omniwinMain.target);



        const omniwinSide2 = await ethers.deployContract("OmniwinSide", [MockRouterClient.target, MockLinkToken]);
        await omniwinSide2.waitForDeployment();

        await omniwinSide2.setUSDCTokenAddress(usdc.target);
        await omniwinSide2.setMainChainSelector(routerConfig.arbitrumSepolia.chainSelector);
        await omniwinSide2.setMainChainRaffleAddress(omniwinMain.target);

        //check if usdc address is set
        const usdcAddress = await omniwinSide.usdcContractAddress();
        expect(usdcAddress).to.equal(usdc.target);

        console.log("Omniwin Mainchain deployed to:", omniwinMain.target, "with owner:", owner.address);
        console.log("Omniwin Sidechain deployed to:", omniwinSide.target, "with owner:", owner.address);
        console.log("Omniwin Sidechain2 deployed to:", omniwinSide2.target, "with owner:", owner.address);

        return { omniwinMain, omniwinSide,omniwinSide2,MockLinkToken, MockRouterClient,vrfCoordinator, nft, erc20, usdc, owner, otherAccount };
    }

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

    describe("Raffle functionality", function () {
        it("Should create raffle on main chain with ERC20 as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

            //contract should own the prize
            const prizeBalance = await erc20.balanceOf(omniwinMain.target);
            expect(prizeBalance).to.equal(prizeAmount);

            //check funding list
            const funding = await omniwinMain.fundingList(raffleId)
            expect(funding.minimumFundsInWei).to.be.equal(minimumFundsInWeis);

            const contractPricesList = await omniwinMain.pricesList(raffleId,0);
            expect(contractPricesList.price).to.be.equal(prices[0].price);

            const contractPricesList1 = await omniwinMain.pricesList(raffleId,1);
            expect(contractPricesList1.price).to.be.equal(prices[1].price);
            
        });

        it("Should create raffle on main chain with ERC721 as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            await nft.connect(otherAccount).approve(omniwinMain.target, tokenId);

            // Check balance
            const balance = await nft.balanceOf(otherAccount.address);
            expect(balance).to.equal(1);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
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
                tokenId,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

            // contract should own the prize
            const prizeOwner = await nft.ownerOf(tokenId);
            expect(prizeOwner).to.equal(omniwinMain.target);
        });

        it("Should create raffle on main chain with ETH as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 2; // ETH, adjust based on enum order
            const prizeAddress = ethers.ZeroAddress; // ETH address
            const prizeAmount = ethers.parseEther("1"); // Amount of ETH to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
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
                {
                    value: prizeAmount
                }
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

            // contract should own the prize
            const prizeBalance = await ethers.provider.getBalance(omniwinMain.target);
            expect(prizeBalance).to.equal(prizeAmount);

        });

        
        it("Should create a new raffle with ERC20 as prize main contract and enable raffle on sidechain", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient,usdc} = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            
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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            const chainSelectors = 
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }

            
                
            // Enable raffle on sidechain
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors);

            await expect(tx2).to.emit(omniwinMain, 'CreateRaffleToSidechain')

            // check if raffle is created on sidechain
            const raffle = await omniwinSide.raffles(raffleId)
            expect(raffle).to.exist;

            expect(raffle.prizeNumber).to.equal(0);
            expect(raffle.assetType).to.equal(ASSET_TYPE.CCIP); // asset type is CCIP, because the prize is held on main contract

            const priceIndex = 1;
            const pricesSidechain = await omniwinSide.pricesList(raffleId,priceIndex);
            expect(pricesSidechain.price).to.equal(prices[priceIndex].price);

        });

        it("Should create a new raffle with ERC20 as prize main contract and enable raffle on 2 sidechains", async function () {
            const { omniwinMain,omniwinSide, omniwinSide2, nft, erc20, owner, otherAccount ,MockRouterClient,usdc} = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);
            await omniwinMain.allowlistDestinationChain(routerConfig.arbitrumSepolia.chainSelector, true);

            //alow source chain from sidecontract. (who do we allow to send us message)
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            await omniwinSide2.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            await omniwinSide2.allowlistSender(omniwinMain.target, true);
            
            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, 
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector,
                    gasLimit: 300_000
                },
                {
                    ccnsReceiverAddress: omniwinSide2.target, 
                    chainSelector: routerConfig.arbitrumSepolia.chainSelector,
                    gasLimit: 300_000
                }
            ];

            // Enable raffle on sidechain bnb
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors[0]);
                await expect(tx2)
                .to.emit(omniwinMain, 'CreateRaffleToSidechain')

            // Enable raffle on sidechain arbitrum
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            const tx3 = await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors[1]);
            await expect(tx3)
                .to.emit(omniwinMain, 'CreateRaffleToSidechain')

            // check if raffle is created on sidechain
            const raffle = await omniwinSide.raffles(raffleId)
            expect(raffle).to.exist;

            const raffle2 = await omniwinSide2.raffles(raffleId)
            expect(raffle2).to.exist;

            expect(raffle.prizeNumber).to.equal(0);
            expect(raffle.assetType).to.equal(ASSET_TYPE.CCIP); // asset type is CCIP, because the prize is held on main contract

            expect(raffle2.prizeNumber).to.equal(0);
            expect(raffle2.assetType).to.equal(ASSET_TYPE.CCIP); // asset type is CCIP, because the prize is held on main contract


            const priceIndex = 1;
            const pricesSidechain = await omniwinSide.pricesList(raffleId,priceIndex);
            expect(pricesSidechain.price).to.equal(prices[priceIndex].price);

            const pricesSidechain2 = await omniwinSide2.pricesList(raffleId,priceIndex);
            expect(pricesSidechain2.price).to.equal(prices[priceIndex].price);

        });

        it("Should fail if sidechain doesnt allow main chain to send transaction (check via sourceChainSelector)", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient, usdc} = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract
            // const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            // await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            
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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }
            ];

            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            await expect(omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(
                raffleId, chainSelectors[0]
            )).to.be.reverted;
        });


        it("Should fail if sidechain doesnt allow main chain to send transaction (check via sender contract)", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient, usdc} = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract
            // await omniwinSide.allowlistSender(omniwinMain.target, true);
            
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
                deadlineDuration
            );
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }
            ];

            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            await expect(omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(
                raffleId, chainSelectors[0]
            )).to.be.reverted;
        });

        it("It should fail because destination chain is not allowed", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient, usdc} = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }
            ]

            // Enable raffle on sidechain
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            await expect(omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(
                raffleId, chainSelectors[0]
            )).to.be.revertedWithCustomError(omniwinMain, "DestinationChainNotAllowlisted");

        });


        it("Should fail if deadline passed maximum deadline", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 30 + 1; // 30 days

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
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "DeadlineExceedsMaximum");
            
        });


        it("Should fail if assetType is CCIP when called from main contract", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 3; // CCIP token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

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
                    price:ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "DirectCCIPRafflesNotAllowed");
            
        });

        it("Should fail if numEntries from prices is 0", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

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
                    numEntries: 0,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "NumEntriesIsZero");
            
        });

        it("Should create raffle from sidechain with ERC20 as prize", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

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

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            //https://www.cryptoneur.xyz/en/gas-fees-calculator
            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;
            const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            //Emitted event to start creation of raffle on main chain
            await expect(tx).to.emit(omniwinSide, "CreateRaffleCCIPEvent")
            
            await expect(tx).to.emit(omniwinMain, 'RaffleCreatedFromSidechain')

            await expect(tx).to.emit(omniwinMain, 'RaffleStarted')


            const rafflesSide = await omniwinSide.raffles(raffleId)
            expect(rafflesSide).to.exist;

            expect(rafflesSide.prizeNumber).to.equal(prizeAmount);
        });
       
        it("Should create raffle from sidechain with ERC721 as prize", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            
            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            await nft.connect(otherAccount).approve(omniwinSide.target, tokenId);
  
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
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;  
            const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                tokenId,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            //Emitted event to start creation of raffle on main chain
            await expect(tx).to.emit(omniwinSide, "CreateRaffleCCIPEvent")
            
            await expect(tx).to.emit(omniwinMain, 'RaffleCreatedFromSidechain')

            //Emitted event that sidechain received ACK and raffle from sidechain was moved from tempRaffles to raffles
            await expect(tx).to.emit(omniwinMain, 'RaffleStarted')

            
            const rafflesSide = await omniwinSide.raffles(raffleId)
            expect(rafflesSide).to.exist;

            expect(rafflesSide.prizeNumber).to.equal(tokenId);
        });

        it("Should create raffle from sidechain with ETH as prize", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 2; // ETH, adjust based on enum order
            const prizeAddress = ethers.ZeroAddress; // ETH address
            const prizeAmount = ethers.parseEther("1"); // Amount of ETH to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
  
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
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;  
            const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit,
                {
                    value: prizeAmount
                }
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId
            
            //Emitted event to start creation of raffle on main chain
            await expect(tx).to.emit(omniwinSide, "CreateRaffleCCIPEvent")
            
            await expect(tx).to.emit(omniwinMain, 'RaffleCreatedFromSidechain')

            //Emitted event that sidechain received ACK and raffle from sidechain was moved from tempRaffles to raffles
            await expect(tx).to.emit(omniwinMain, 'RaffleStarted')

            const rafflesSide = await omniwinSide.raffles(raffleId)
            expect(rafflesSide).to.exist;

            expect(rafflesSide.prizeNumber).to.equal(prizeAmount);
        });

        //FAIL WITH PRIZE ON RAFFLE CREATION ON SIDECHAIN
        it("Should fail to create raffle from sidechain with ERC20 as prize", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
  
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

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 100;
            await erc20.transfer(otherAccount.address, amount);

            await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);

            
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000; 
            await expect(omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            )).to.be.revertedWith("ERC20: transfer amount exceeds balance");
        });
       
        it("Should fail to create raffle from sidechain with ERC721 as prize (ContractNotApproved)", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            
            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            // await nft.connect(otherAccount).approve(omniwinSide.target, tokenId);
  
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
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;
            await expect(omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                tokenId ,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            )).to.revertedWithCustomError(omniwinSide, "ContractNotApproved()");
        });

        it("Should fail to create raffle from sidechain with ERC721 as prize (NotTheNFTOwner)", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            await nft.mintCollectionNFT(owner.address, tokenId + 1);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            
            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            // await nft.connect(otherAccount).approve(omniwinSide.target, tokenId);
  
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
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;  
            await expect(omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                tokenId + 1,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            )).to.revertedWithCustomError(omniwinSide, "NotTheNFTOwner()");
        });

        it("Should fail to create raffle from sidechain with ETH as prize (ETHPrizeAmountMismatch)", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 2; // ETH, adjust based on enum order
            const prizeAddress = ethers.ZeroAddress; // ETH address
            const prizeAmount = ethers.parseEther("1"); // Amount of ETH to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
  
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
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;  
            await expect(omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit,
                {
                    value: prizeAmount - BigInt(1)
                }
            )).to.revertedWithCustomError(omniwinSide, "ETHPrizeAmountMismatch()");
        });




        //FAIL WITH PRIZE ON RAFFLE CREATION ON MAINCHAIN
        it("Should fail to create raffle on main chain with ERC20 as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 100;
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
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];


            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWith("ERC20: transfer amount exceeds balance");

        });

        it("Should fail to create raffle on main chain with ERC721 as prize (NotTheNFTOwner)", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            await nft.mintCollectionNFT(owner.address, tokenId + 1);
            expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            await nft.connect(otherAccount).approve(omniwinMain.target, tokenId);

            // Check balance
            const balance = await nft.balanceOf(otherAccount.address);
            expect(balance).to.equal(1);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                tokenId + 1,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "NotTheNFTOwner");
        });

        it("Should fail to create raffle on main chain with ERC721 as prize (ContractNotApproved)", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            // await nft.connect(otherAccount).approve(omniwinMain.target, tokenId);

            // Check balance
            const balance = await nft.balanceOf(otherAccount.address);
            expect(balance).to.equal(1);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                tokenId,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "ContractNotApproved");
        });

        it("Should fail to create raffle on main chain with ETH as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 2; // ETH, adjust based on enum order
            const prizeAddress = ethers.ZeroAddress; // ETH address
            const prizeAmount = ethers.parseEther("1"); // Amount of ETH to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                {
                    value: prizeAmount - BigInt(1)
                }
            )).to.be.revertedWithCustomError(omniwinMain, "ETHPrizeAmountMismatch");
        });

        //FOR THIS TEST TO WORK, UNCOMMENT if (gasLimit == 0) {, in createraffleCCIP
        // it.only("Should set status fail on sidechain if raffle is not created in main chain", async function () {
        //     const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient,usdc} = await loadFixture(deployContract);

        //     //mint usdc
        //     const mintAmount = ethers.parseUnits("2000", 6);
        //     await usdc.mint(otherAccount, mintAmount);

        //     const minimumFundsInWeis = ethers.parseEther("1");
        //     const assetType = 0; // ERC20 token, adjust based on enum order
        //     const prizeAddress = erc20.target; // Token contract
        //     const prizeAmount = 1000; // Number of tokens to be used as the prize
        //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

        //     // Define prices for entries into the raffle
        //     const prices = [
        //         {
        //             id: 0,
        //             numEntries: 2,
        //             price: ethers.parseUnits("10", 6),
        //         },
        //         {
        //             id: 1,
        //             numEntries: 5,
        //             price: ethers.parseUnits("30", 6), // Slight discount for buying more
        //         },
        //     ];

        //     // Step 1: Transfer tokens to `otherAccount` to be used as the prize
        //     const amount = 1000;
        //     await erc20.transfer(otherAccount.address, amount);

        //     await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);

        //     //allow main contract to receive from source chain
        //     const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
        //     await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

        //     //Allow sidechain to send message to main
        //     await omniwinMain.allowlistSender(omniwinSide.target, true);

        //     //we need to allow main contract to send back ack
        //     await omniwinSide.allowlistSender(omniwinMain.target, true);

        //     //we allow main contract to be able to send ack back to sidechain
        //     await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

        //     await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

        //     // Call createRaffle with the defined parameters
        //     const gasLimit = 0;
        //     const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
        //         prizeAddress,
        //         prizeAmount,
        //         minimumFundsInWeis,
        //         prices,
        //         assetType,
        //         deadlineDuration,
        //         gasLimit
        //     );
        //     await tx.wait();

        //     // const newTime = (await ethers.provider.getBlock('latest'))?.timestamp;
        //     // console.log("Blockchain Time:", new Date((newTime || 0) * 1000).toISOString());


        //     //pass time to check if raffle is created on main chain, deadline + 7 days
        //     await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7  + 60 * 60 * 24 * 7]);
        //     await ethers.provider.send("evm_mine", []);


        //     const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
        //     const eventEmittedLogs = receipt?.logs?.map(log => omniwinSide.interface.parseLog(log)).find(log => log?.name === "CreateRaffleCCIPEvent");
        //     const raffleId = eventEmittedLogs?.args?.raffleId

        //     console.log(raffleId)

        //     //checkRaffleCreationOnMainChain
        //     await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee * BigInt(2));           
        //     await omniwinSide.connect(otherAccount).checkRaffleCreationOnMainChain(raffleId,600_000,300_000);

        //     //check balance before refund
        //     const balance = await erc20.balanceOf(otherAccount.address);
        //     console.log("balance before: ",balance.toString());

        //     //claim refund asset
        //     await omniwinSide.connect(otherAccount).reclaimAsset(raffleId);

        //     //check balance after refund
        //     const balanceAfter = await erc20.balanceOf(otherAccount.address);
        //     console.log("balance after: ",balanceAfter.toString());

        //     expect(balanceAfter).to.be.equal(balance + BigInt(prizeAmount));
        // });
    });

    describe("Raffle Tickets functionality", function () {
        beforeEach(async function () {
            // Load the initial setup fixture
            const { omniwinMain,omniwinSide,usdc, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);
            

            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            //Create raffle on main chain and on secondary chains (chainSelectors)
  
            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain - allow messages from main chain to be sent only to BNBTestnet
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract. We allow to receive messages from main chain (sourceChainSelector)
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);


            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            await omniwinMain.allowlistSender(omniwinSide.target, true);

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
                deadlineDuration
            );

            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            console.log("Raffle ID: ", raffleId)


            //enable raffle on sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }
            ];

            // Enable raffle on sidechain
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors[0]);

            
            // Extend this object with more properties as needed by tests
            this.testContext = { omniwinMain, omniwinSide,usdc, erc20, otherAccount, raffleId,owner };
        });

        it("Should allow buying tickets on main chain", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount,raffleId } = this.testContext;

            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
            
            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            
            // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price +  ccipMessageFee);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2  + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            const funding = await omniwinMain.rafflesEntryInfo(raffleId);

            const totalFunding = price + price2;

            expect(funding[2]).to.be.equal(totalFunding);

        });

        it("Should allow buying tickets on both main and side chains", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount, raffleId } = this.testContext;

            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
            
            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            
            // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price + ccipMessageFee);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2 + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            // B. Buy tickets on side chain
            
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price + ccipMessageFee);

            // Buy entry type 1
            const gasLimit = 300_000;
            const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, gasLimit);
            await buyTx1Side.wait();


            const funding = await omniwinMain.rafflesEntryInfo(raffleId)
            const totalFunding = price + price + price2;

            expect(funding[2]).to.be.equal(totalFunding);
        });


        it("Should claim refund bought tickets on main chain", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount, raffleId,owner } = this.testContext;

            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);

            // A. Buy tickets on main chain

            // Buy entry type 1
            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
                
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price + ccipMessageFee);

            //TODO:  not sure why i need price beside priceIndex (i knot the price from priceIndex....)
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2 + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2);
            await buyTx2.wait();


            // Buy entry type 3
            //give allowance to omniwin for first buy
            await usdc.approve(omniwinMain.target, price + ccipMessageFee);
            //check allowance of ownern not of otheraccount
            expect(await usdc.allowance(owner.address, omniwinMain.target)).to.be.equal(price + ccipMessageFee);

            const buyTx3 = await omniwinMain.buyEntry(raffleId, priceIndex);
            await buyTx3.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            //pass time to make sure raffle is over
            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);

            //balance of other account before refund
            const balanceBefore = await usdc.balanceOf(otherAccount.address);

            // B. Claim refund on main chain
            const refundTx = await omniwinMain.connect(otherAccount).claimRefundBoughtTickets(raffleId);
            await refundTx.wait();

            //check balance after refund
            const balanceAfter = await usdc.balanceOf(otherAccount.address);

            //check balance
            expect(balanceAfter).to.be.equal(balanceBefore + price + price2);
        });

        it("Should claim refund bought tickets on side chain", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount, raffleId,owner } = this.testContext;

            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            const gasLimit = 350_000;

            // A. Buy tickets on main chain

            // Buy entry type 1
            const priceIndex = 0;
            const prices = await omniwinSide.pricesList(raffleId, priceIndex);
            const price = prices.price;
                
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price + ccipMessageFee);

            //TODO:  not sure why i need price beside priceIndex (i knot the price from priceIndex....)
            const buyTx1 = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex,gasLimit);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinSide.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price2 + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex2,gasLimit);
            await buyTx2.wait();


            // Buy entry type 3
            //give allowance to omniwin for first buy
            await usdc.approve(omniwinSide.target, price + ccipMessageFee);
            //check allowance of ownern not of otheraccount
            expect(await usdc.allowance(owner.address, omniwinSide.target)).to.be.equal(price + ccipMessageFee);

            const buyTx3 = await omniwinSide.buyEntry(raffleId, priceIndex,gasLimit);
            await buyTx3.wait();

            //check bought tickets
            const tickets = await omniwinSide.entriesList(raffleId,1);
            expect(tickets).to.exist;

            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);

            //Send status failed to sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000
                }
            ];

            await omniwinMain.sendPrizeDistributionMessagesWithStatusFail(raffleId, chainSelectors);


            //balance of other account before refund
            const balanceBefore = await usdc.balanceOf(otherAccount.address);

            // B. Claim refund on main chain
            const refundTx = await omniwinSide.connect(otherAccount).claimRefundBoughtTickets(raffleId);
            await refundTx.wait();

            //check balance after refund
            const balanceAfter = await usdc.balanceOf(otherAccount.address);

            //check balance
            expect(balanceAfter).to.be.equal(balanceBefore + price + price2);
        });

        it("Should claim refund bought tickets on both main and side chains", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount, raffleId,owner } = this.testContext;

            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            const gasLimit = 350_000;

            // A. Buy tickets on main chain

            // Buy entry type 1
            const priceIndex = 0;
            const prices = await omniwinSide.pricesList(raffleId, priceIndex);
            const price = prices.price;
                
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price + ccipMessageFee);

            //TODO:  not sure why i need price beside priceIndex (i knot the price from priceIndex....)
            const buyTx1 = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, gasLimit);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinSide.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price2 + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex2, gasLimit);
            await buyTx2.wait();


            // Buy entry type 3
            //give allowance to omniwin for first buy
            await usdc.approve(omniwinMain.target, price + ccipMessageFee);
            //check allowance of ownern not of otheraccount
            expect(await usdc.allowance(owner.address, omniwinMain.target)).to.be.equal(price + ccipMessageFee);

            const buyTx3 = await omniwinMain.buyEntry(raffleId, priceIndex);
            await buyTx3.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,0);
            expect(tickets).to.exist;

            //pas time to make sure raffle is over
            await ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);

            //Send status failed to sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 350_000
                }
            ];

            await omniwinMain.sendPrizeDistributionMessagesWithStatusFail(raffleId, chainSelectors);

            //OtherACcount side balance check
            //balance of other account before refund
            const balanceBefore = await usdc.balanceOf(otherAccount.address);

            // B. Claim refund on side chain
            const refundTx = await omniwinSide.connect(otherAccount).claimRefundBoughtTickets(raffleId);
            await refundTx.wait();

            //check balance after refund
            const balanceAfter = await usdc.balanceOf(otherAccount.address);

            //check balance
            expect(balanceAfter).to.be.equal(balanceBefore + price + price2);

            //Main account main balance check
            //balance of other account before refund
            const balanceBeforeMain = await usdc.balanceOf(owner.address);
            
            // B. Claim refund on main chain
            const refundTxMain = await omniwinMain.connect(owner).claimRefundBoughtTickets(raffleId);
            await refundTxMain.wait();

            //check balance after refund
            const balanceAfterMain = await usdc.balanceOf(owner.address);

            //check balance
            expect(balanceAfterMain).to.be.equal(balanceBeforeMain + price);
        });

        //FOR THIS TEST TO WORK, uncomment bytes32 messageId = 0x726566756e64636369706d657373616765696400000000000000000000000000; from omniwinSide.sol
        // it.only("Should claim refund bought ticket if raffle is success but CCIP hasn t arrived on main chain", async function () {
        //     const { omniwinMain,usdc, omniwinSide, erc20, otherAccount, raffleId,owner } = this.testContext;

        //     //mint some USDC
        //     const mintAmount = ethers.parseUnits("2000", 6);
        //     await usdc.mint(otherAccount, mintAmount);
        //     const gasLimit = 0; // So it fails

        //     // A. Buy tickets on main chain

        //     // Buy entry type 1
        //     const priceIndex = 0;
        //     const prices = await omniwinSide.pricesList(raffleId, priceIndex);
        //     const price = prices.price;
                
        //     //give allowance to omniwin for first buy
        //     await usdc.connect(otherAccount).approve(omniwinSide.target, price + ccipMessageFee);
        //     expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price + ccipMessageFee);

        //     //TODO:  not sure why i need price beside priceIndex (i knot the price from priceIndex....)
        //     const buyTx1 = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, gasLimit);
        //     await buyTx1.wait();

        //     const receipt = await ethers.provider.getTransactionReceipt(buyTx1.hash);
        //     const eventEmittedLogs = receipt?.logs?.map(log => omniwinSide.interface.parseLog(log)).find(log => log?.name === "EntrySold");
        //     const messageId = eventEmittedLogs?.args?.messageId

        //     //balance of other account before refund
        //     const balanceBefore = await usdc.balanceOf(otherAccount.address);
        //     console.log("Balance before refund:", balanceBefore.toString());

        //     // B. Claim refund on main chain
        //     //for testing
        // // bytes32 messageId = 0x726566756e64636369706d657373616765696400000000000000000000000000;
        //     console.log("bytes32:", messageId);
        //     await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
        //     const refundTx = await omniwinSide.connect(otherAccount).claimRefundBoughtTicketCCIP(raffleId, messageId, 650_000, 300_000);
        //     await refundTx.wait();

        //     //check balance after refund
        //     const balanceAfter = await usdc.balanceOf(otherAccount.address);
        //     console.log("Balance after refund:", balanceAfter.toString());

        //     //check balance
        //     // expect(balanceAfter).to.be.equal(balanceBefore + price - ccipMessageFee);
        //     // await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
        //     // const refundTx2 = await omniwinSide.connect(otherAccount).claimRefundBoughtTicketCCIP(raffleId, messageId, 650_000, 300_000);
        //     // expect(refundTx2).to.be.revertedWithCustomError(omniwinSide, "RefundAlreadyClaimed");

        //     // const refundTx3 = await omniwinSide.claimRefundBoughtTicketCCIP(raffleId, messageId, 650_000, 300_000);
        //     // expect(refundTx3).to.be.revertedWithCustomError(omniwinSide, "NotTheBuyer");


        // });
    });

    describe("Raffle vrf", function () {
        beforeEach(async function () {
            // Load the initial setup fixture
            const { omniwinMain,omniwinSide, omniwinSide2, usdc, nft, erc20, owner, otherAccount,MockLinkToken ,MockRouterClient,vrfCoordinator} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseUnits("3", 6);
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 100; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain - allow messages from main chain to be sent only to BNBTestnet
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);
            await omniwinMain.allowlistDestinationChain(routerConfig.polygonMumbai.chainSelector, true);

            //alow source chain from sidecontract. We allow to receive messages from main chain (sourceChainSelector)
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            await omniwinSide2.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide2.allowlistSender(omniwinMain.target, true);
            await omniwinMain.allowlistSender(omniwinSide2.target, true);

            //mint some USDC
            const mintAmount = ethers.parseUnits("1000000", 6);
            await usdc.mint(otherAccount, mintAmount);

            //mint some Link
            const linkAmount = ethers.parseUnits("10000", 18);
            await MockLinkToken.transfer(omniwinMain.target, linkAmount);
            await MockLinkToken.transfer(omniwinSide.target, linkAmount);
            
            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000 * 10 ** 6;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

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

            await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);

            await usdc.connect(otherAccount).approve(omniwinSide.target, ccipMessageFee);
            const gasLimit = 300_000;  
            await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                gasLimit
            )


            const prizeAddressNft = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const assetTypeNft = 1; // ERC721 token, adjust based on enum order

            await nft.mintCollectionNFT(owner.address, tokenId);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            await nft.connect(otherAccount).approve(omniwinSide2.target, tokenId);

            await usdc.connect(otherAccount).approve(omniwinSide2.target, ccipMessageFee);
            await omniwinSide2.connect(otherAccount).CreateRaffleCCIP(
                prizeAddressNft,
                tokenId,
                minimumFundsInWeis,
                prices,
                assetTypeNft,
                deadlineDuration,
                gasLimit
            )

            // Call createRaffle with the defined parameters
            const tx  = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            await tx.wait(); // Wait for the transaction to be mined
            // Fetch the transaction receipt to access the event logs
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const eventEmittedLogs = receipt?.logs?.map(log => omniwinMain.interface.parseLog(log)).find(log => log?.name === "RaffleStarted");
            const raffleId = eventEmittedLogs?.args?.raffleId

            //enable raffle on sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 350_000
                },
                {
                    ccnsReceiverAddress: omniwinSide2.target, // This should be an Ethereum address
                    chainSelector: routerConfig.polygonMumbai.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 350_000
                }
            ];

            // Enable raffle on sidechain
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors[0]);
            await usdc.connect(otherAccount).approve(omniwinMain.target, ccipMessageFee);
            await omniwinMain.connect(otherAccount).enableCreateRaffleOnSidechain(raffleId, chainSelectors[1]);


            const priceIndex = 0;
              // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, prices[priceIndex].price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(prices[priceIndex].price + ccipMessageFee);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2 + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2 + ccipMessageFee);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            // B. Buy tickets on side chain
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, prices[priceIndex].price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(prices[priceIndex].price + ccipMessageFee);

            // Buy entry type 1
            const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex,gasLimit);
            await buyTx1Side.wait();




             // C. Buy tickets on side chain 2
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide2.target, prices[priceIndex].price + ccipMessageFee);
            expect(await usdc.allowance(otherAccount.address, omniwinSide2.target)).to.be.equal(prices[priceIndex].price + ccipMessageFee);

            // Buy entry type 1
            const buyTx2Side = await omniwinSide2.connect(otherAccount).buyEntry(raffleId, priceIndex,gasLimit);
            await buyTx2Side.wait();


            const funding = await omniwinMain.rafflesEntryInfo(raffleId)
            const totalFunding = prices[priceIndex].price + prices[priceIndex].price + price2 + prices[priceIndex].price;

            expect(funding[2]).to.be.equal(totalFunding);
            
            // Extend this object with more properties as needed by tests
            this.testContext = { omniwinMain, omniwinSide, omniwinSide2,usdc, erc20, otherAccount,vrfCoordinator,raffleId };
        });

        it("Pick a winner", async function () {
            const { omniwinMain, omniwinSide,omniwinSide2,usdc, erc20, otherAccount,vrfCoordinator,raffleId } = this.testContext;


            console.log("account: ",otherAccount.address);
            console.log("omniwinMain: ",omniwinMain.target);

            //set winner
            const callbackGasLimit = 300_000;
            const requestConfirmations = 10;
            const randomness = 1;
            const tx = await omniwinMain.setWinner(raffleId, callbackGasLimit, requestConfirmations, randomness);

            //check for event
            const amountRaised = (await omniwinMain.rafflesEntryInfo(raffleId))[2];
            console.log("Usd raised: ",BigInt(amountRaised)/BigInt(10**6));

            await expect(tx).to.emit(omniwinMain, "SetWinnerTriggered").withArgs(raffleId, amountRaised);

            //manually call fulfillRandomWords (on mainnet chainlink will do this)
            const requestId = 1;
            await vrfCoordinator.fulfillRandomWords(requestId,omniwinMain.target)


            //we send all supported chains, and let the contract check it should send messages to them
            const allSupportedChains = [
                {
                    ccnsReceiverAddress: omniwinSide.target,
                    gasLimit: 300_000,
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector
                },
                { 
                    ccnsReceiverAddress: omniwinSide2.target,
                    gasLimit: 300_000,
                    chainSelector: routerConfig.polygonMumbai.chainSelector
                }
            ] 

            // After fulfillRandomWords has been called => winner has been set in the raffle
            const tx2 = await omniwinMain.sendPrizeDistributionMessages(raffleId, allSupportedChains)
            await expect(tx2).to.emit(omniwinMain, "FeeTransferredToPlatform")

            for(let chain of allSupportedChains){
                await expect(tx2).to.emit(omniwinMain, "PrizeDistributionToSidechain")
            }



            const fundingList = await omniwinMain.fundingList(raffleId);
            expect(fundingList.platformFeeCollected).to.be.equal(true);

            //FeeTransferredToPlatform

            //check if winner has been set
            const winner = await omniwinMain.raffles(raffleId);
            expect(winner.winner).to.be.equal(otherAccount.address);

            //claim raised money on main chain
            await omniwinMain.connect(otherAccount).claimCash(raffleId);

            const winnerBalanceBefore = await erc20.balanceOf(otherAccount.address);


            //winner claim prize from main - same account because he s also the winner...
            await omniwinMain.connect(otherAccount).claimPrize(raffleId);
            //expect winner to hold the prize
            const winnerBalanceAfterClaim = await erc20.balanceOf(otherAccount.address);
            expect(winnerBalanceAfterClaim).to.be.equal(winnerBalanceBefore + BigInt(100));


            //claim raised money on side chain
            const tx3 = await omniwinSide.connect(otherAccount).claimCash(raffleId);
            const amountToClaimMinusFee = ethers.parseUnits("10", 6) - (ethers.parseUnits("10", 6) * BigInt(600))/BigInt(10000);
            await expect(tx3).to.emit(omniwinSide, "CashClaimed").withArgs(raffleId, otherAccount.address,  amountToClaimMinusFee);

            //claim raised money on side chain 2
            const tx4 = await omniwinSide2.connect(otherAccount).claimCash(raffleId);
            const amountToClaimMinusFee2 = ethers.parseUnits("10", 6) - (ethers.parseUnits("10", 6) * BigInt(600))/BigInt(10000);
            await expect(tx4).to.emit(omniwinSide2, "CashClaimed").withArgs(raffleId, otherAccount.address,  amountToClaimMinusFee2);
        });
    });
});